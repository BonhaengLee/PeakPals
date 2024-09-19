import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Linking,
  Pressable,
  SafeAreaView,
  Image,
} from "react-native";
import {
  NaverMapView,
  NaverMapViewRef,
  NaverMapMarkerOverlay,
} from "@mj-studio/react-native-naver-map";
import * as Location from "expo-location";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { supabase } from "../lib/supabaseClient";

// MainTabs 높이 + 40px을 계산
const MAIN_TABS_HEIGHT = 92; // MainTabs의 높이
const MIN_SHEET_HEIGHT = MAIN_TABS_HEIGHT + 40; // 항상 최소한 이 높이까지만 내려가게 함

const checkIfLocationServicesEnabled = async () => {
  const isEnabled = await Location.hasServicesEnabledAsync();
  if (!isEnabled) {
    Alert.alert(
      "위치 서비스 비활성화",
      "위치 서비스가 꺼져 있습니다. 설정에서 활성화해 주세요.",
      [
        { text: "설정으로 가기", onPress: () => Linking.openSettings() },
        { text: "취소", style: "cancel" },
      ]
    );
    return false;
  }
  return true;
};

const requestLocationPermission = async (setLocationPermission: Function) => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      setLocationPermission(true);
      return true;
    } else {
      Alert.alert(
        "위치 권한 필요",
        "위치 권한을 허용해야 이 기능을 사용할 수 있습니다.",
        [
          { text: "설정으로 가기", onPress: () => Linking.openSettings() },
          { text: "취소", style: "cancel" },
        ]
      );
      setLocationPermission(false);
      return false;
    }
  } catch (error) {
    console.error("위치 권한 요청 실패:", error);
    setLocationPermission(false);
    return false;
  }
};

const startTrackingLocation = async (
  setLocation: Function,
  setLocationError: Function
) => {
  try {
    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 1,
        timeInterval: 5000,
      },
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }
    );
  } catch (error) {
    console.error("위치 정보 에러:", error);
    setLocationError("위치 정보를 가져오는 중 오류가 발생했습니다.");
  }
};

export default function HomeScreen() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null
  );
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isSheetFullyOpen, setIsSheetFullyOpen] = useState(false); // 바텀시트 열린 상태
  const mapViewRef = useRef<NaverMapViewRef>(null);

  useEffect(() => {
    const initializeLocation = async () => {
      const isServiceEnabled = await checkIfLocationServicesEnabled();
      if (!isServiceEnabled) return;

      const hasPermission = await requestLocationPermission(
        setLocationPermission
      );
      if (hasPermission) {
        startTrackingLocation(setLocation, setLocationError);
      }
    };

    initializeLocation();
  }, []);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [MIN_SHEET_HEIGHT, "50%", "90%"], []);

  const moveToCurrentLocation = () => {
    if (location && mapViewRef.current) {
      mapViewRef.current.animateCameraTo({
        latitude: location.latitude,
        longitude: location.longitude,
        zoom: 16,
        duration: 800,
      });
    } else {
      console.error("mapViewRef is not initialized");
    }
  };

  const renderContent = () => (
    <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
      <Text style={styles.modalText}>바텀 시트 내용</Text>
    </BottomSheetScrollView>
  );

  // 바텀시트 상태 변경 시 호출되는 함수
  const handleSheetChanges = useCallback((index: number) => {
    // 바텀시트가 완전히 열렸는지 여부 업데이트
    setIsSheetFullyOpen(index === 2); // index가 2이면 완전히 열린 상태
  }, []);

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {locationError || "현재 위치를 가져오는 중입니다..."}
        </Text>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 지도는 SafeAreaView 밖에서 터치 가능하도록 배치 */}
      <NaverMapView
        ref={mapViewRef}
        style={styles.map}
        center={{
          latitude: location.latitude,
          longitude: location.longitude,
          zoom: 16,
        }}
      >
        {/* 현재 위치 마커 */}
        <NaverMapMarkerOverlay
          latitude={location.latitude}
          longitude={location.longitude}
          width={24} // 마커의 크기 조절
          height={24}
          anchor={{ x: 0.5, y: 1 }} // 마커의 위치 조정
          image={require("../assets/images/maps/myLocationPoint.png")} // 마커 이미지 설정
        />
      </NaverMapView>

      {/* SafeAreaView는 바텀 시트 안에만 적용 */}
      <View
        style={{
          position: "relative",
          flex: 1,
          width: "100%",
          height: "min-content",
        }}
      >
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={false} // 완전히 닫히지 않도록 설정
          handleIndicatorStyle={{ backgroundColor: "#000" }}
          backdropComponent={null} // Backdrop을 제거
          enableOverDrag={false} // 위로 드래그할 수 없도록 방지
          enableContentPanningGesture={true} // 바텀 시트 내용에 대한 팬 제스처 허용
          onChange={handleSheetChanges} // 바텀시트 상태 변경 핸들러 추가
        >
          <SafeAreaView style={styles.bottomSheetContent}>
            {renderContent()}
          </SafeAreaView>
        </BottomSheet>

        {/* "현재 위치로 이동" 버튼 */}
        {!isSheetFullyOpen && locationPermission && (
          <Pressable
            onPress={moveToCurrentLocation}
            style={[styles.locationButton, { bottom: MIN_SHEET_HEIGHT + 16 }]} // 바텀시트 16px 위에 위치
          >
            <Image
              source={require("../assets/images/maps/moveMyLocation.png")}
              style={styles.locationButtonImage}
              resizeMode="contain"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "darkgray",
    textAlign: "center",
    marginBottom: 20,
  },
  bottomSheetContent: {
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  locationButton: {
    position: "absolute",
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
    height: 44,
    width: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  locationButtonImage: {
    width: 44,
    height: 44,
  },
});
