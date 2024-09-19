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
} from "react-native";
import {
  NaverMapView,
  NaverMapViewRef,
} from "@mj-studio/react-native-naver-map";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

// MainTabs 높이 + 40px을 계산
const MAIN_TABS_HEIGHT = 76; // MainTabs의 높이
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
        "위치 권한을 허용해야 이 기능을 사용할 수 있습니다. 설정에서 권한을 허용해주세요.",
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

  // snapPoints를 최소 높이로 설정
  const snapPoints = useMemo(() => [`${MIN_SHEET_HEIGHT}px`, "50%", "90%"], []);

  const handleOpenPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const renderContent = () => (
    <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
      <Text style={styles.modalText}>바텀 시트 내용</Text>
    </BottomSheetScrollView>
  );

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
      <NaverMapView
        ref={mapViewRef}
        style={styles.map}
        center={{
          latitude: location.latitude,
          longitude: location.longitude,
          zoom: 16,
        }}
      />

      <SafeAreaView>
        <BottomSheet
          ref={bottomSheetRef}
          index={0} // 초기 상태를 0으로 설정하여 바텀시트가 열리도록 함
          snapPoints={snapPoints} // 최소 높이부터 시작하도록 설정
          enablePanDownToClose={false} // 드래그로 완전히 닫히는 것 방지
          handleIndicatorStyle={{ backgroundColor: "#fff" }}
          backdropComponent={renderBackdrop}
        >
          {renderContent()}
        </BottomSheet>
      </SafeAreaView>
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
});
