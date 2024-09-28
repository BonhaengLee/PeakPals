import BottomSheet, {
  BottomSheetBackgroundProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  NaverMapMarkerOverlay,
  NaverMapView,
  NaverMapViewRef,
} from "@mj-studio/react-native-naver-map";
import * as Location from "expo-location";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { supabase } from "../lib/supabaseClient";
import { ClimbingCenter, SimplifiedCenter } from "../types";
import { colors } from "../styles/colors";
import { RenderLocationError } from "../components/RenderLocationError";
import { SegmentedControl } from "../components/find-center/SegmentedControl";
import {
  renderNearbyCenters,
  renderSavedCenters,
} from "../components/find-center/CenterList";
import { nearbyCenters, savedCenters } from "../mock/data";

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
  const [sheetIndex, setSheetIndex] = useState(0);

  const mapViewRef = useRef<NaverMapViewRef>(null);

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

  const handleSheetChanges = useCallback((index: number) => {
    setSheetIndex(index);
  }, []);

  const [activeTab, setActiveTab] = useState("saved");
  const renderCenters = () => {
    if (activeTab === "saved") {
      return renderSavedCenters(savedCenters);
    } else if (activeTab === "nearby") {
      return renderNearbyCenters(nearbyCenters);
    }
  };

  const [centers, setCenters] = useState<ClimbingCenter[]>([]); // Supabase에서 가져온 센터 데이터
  useEffect(() => {
    const fetchCenters = async () => {
      const { data, error } = await supabase.from("ClimbingCenter").select("*");
      if (error) {
        console.error("Error fetching centers:", error);
      } else {
        setCenters(data || []);
      }
    };
    fetchCenters();
  }, []);

  const handleCenterMarkerClick = (centerId: number) => {
    // 센터 ID를 기반으로 해당 센터 페이지로 이동하는 로직
    // 여기서 라우팅 처리
    console.log("센터 선택됨, ID:", centerId);
    // 필요 시 네비게이션 추가
  };

  const renderHandle = useCallback(
    () => (
      <View style={styles.bottomSheetHandle}>
        <View style={styles.handleBar} />
      </View>
    ),
    []
  );

  const renderContent = useCallback(
    () => (
      <BottomSheetScrollView
        contentContainerStyle={styles.bottomSheetScrollViewContent}
      >
        <SegmentedControl activeTab={activeTab} setActiveTab={setActiveTab} />

        {renderCenters()}
      </BottomSheetScrollView>
    ),
    [activeTab]
  );

  const CustomBackground = ({ style }: BottomSheetBackgroundProps) => (
    <View
      style={[
        style,
        {
          backgroundColor: colors.ui04,
        },
      ]}
    />
  );

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

  useEffect(() => {
    initializeLocation(); // 처음 로드될 때 위치 정보 요청
  }, []);

  if (locationError) {
    return (
      <RenderLocationError
        locationError={locationError}
        retryFunction={initializeLocation}
      />
    );
  }

  if (!location && locationPermission !== null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="gray" />
        <Text style={styles.loadingText}>위치 정보를 가져오는 중입니다...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 지도 */}
      <NaverMapView
        ref={mapViewRef}
        style={styles.map}
        center={{
          latitude: location?.latitude,
          longitude: location?.longitude,
          zoom: 16,
        }}
      >
        {/* 내 위치 - location 없으면 제외 */}
        {location ? (
          <NaverMapMarkerOverlay
            latitude={location?.latitude ?? 0}
            longitude={location?.longitude ?? 0}
            width={24}
            height={24}
            anchor={{ x: 0.5, y: 1 }}
            image={require("../assets/images/maps/me.png")}
          />
        ) : null}

        {centers.map((center) => (
          <NaverMapMarkerOverlay
            key={center.id}
            latitude={center.latitude}
            longitude={center.longitude}
            width={32}
            height={32}
            anchor={{ x: 0.5, y: 1 }}
            image={require("../assets/images/maps/center.png")}
            onClick={() => handleCenterMarkerClick(center.id)}
          />
        ))}
      </NaverMapView>

      <View style={styles.bottomSheetContainer} pointerEvents="box-none">
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          backdropComponent={null}
          /* 
              바텀시트가 전체 높이까지 열릴 수 있으면서도, 
              바텀시트가 닫혀있거나 부분적으로 열려있을 때 지도와의 인터랙션 가능
              바텀시트는 핸들 영역이나 내부 컨텐츠를 통해서만 드래그 가능
          */
          handleComponent={renderHandle}
          enableOverDrag={false}
          enableContentPanningGesture={true}
          onChange={handleSheetChanges}
          backgroundComponent={CustomBackground}
        >
          {renderContent()}
        </BottomSheet>
      </View>

      {/* "현재 위치로 이동" 버튼 */}
      {sheetIndex === 0 && locationPermission && (
        <Pressable
          onPress={moveToCurrentLocation}
          style={[styles.locationButton, { bottom: MIN_SHEET_HEIGHT + 16 }]}
        >
          <Image
            source={require("../assets/images/maps/moveMyLocation.png")}
            style={styles.locationButtonImage}
            resizeMode="contain"
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "relative", // 최상위 컨테이너로 설정
  },
  map: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  bottomSheetContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
    zIndex: 2,
    padding: 16,
    // backgroundColor: colors.ui04,
  },
  bottomSheetHandle: {
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: colors.ui04,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.bottomSheetHandleBlack,
    borderRadius: 2,
  },
  bottomSheetScrollViewContent: {
    padding: 20,
    backgroundColor: colors.ui04,
    flexGrow: 1,
  },
  bottomSheetContent: {
    padding: 20,
    height: "100%",
    backgroundColor: colors.ui03,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: "red",
    height: "100%",
  },
  locationButton: {
    position: "absolute",
    right: 16,
    bottom: MIN_SHEET_HEIGHT + 16, // 바텀시트 위 16px에 위치
    backgroundColor: "#fff",
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 0,
    height: 44,
    width: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  locationButtonImage: {
    width: 44,
    height: 44,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    marginBottom: 20,
  },
  centerContainer: {
    backgroundColor: colors.ui03,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  centerName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  centerAddress: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
  },
  visitCountContainer: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 1,
    borderRadius: 16,
  },
  visitCountText: {
    color: colors.textWhite,
    fontSize: 14,
  },
  starIcon: {
    width: 32,
    height: 32,
  },
  openStatus: {
    color: "#d1d5db",
    fontSize: 14,
    marginTop: 8,
  },
  segmentedControl: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: colors.ui03,
    color: colors.coreSecondary,
  },
  segmentButtonLeft: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  segmentButtonRight: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  segmentButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text02,
  },
  activeSegment: {
    backgroundColor: colors.primary,
  },
  activeSegmentText: {
    color: colors.textBlack,
  },
});
