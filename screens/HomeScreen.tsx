import {
  NaverMapMarkerOverlay,
  NaverMapView,
  NaverMapViewRef,
} from "@mj-studio/react-native-naver-map";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { supabase } from "../lib/supabaseClient";
import { ClimbingCenter } from "../types";
import { colors } from "../styles/colors";
import { RenderLocationError } from "../components/RenderLocationError";
import {
  renderNearbyCenters,
  renderSavedCenters,
} from "../components/find-center/CenterList";
import { nearbyCenters, savedCenters } from "../mock/data";
import {
  checkIfLocationServicesEnabled,
  requestLocationPermission,
  startTrackingLocation,
} from "../lib/find-center/locationUtils";
import CenterSearchBar from "../components/find-center/CenterSearchBar";
import { RootStackScreenProps } from "../navigation/types";
import { MapContext } from "../context/MapContext";
import BottomSheetComponent from "../components/find-center/BottomSheetComponent";
import MapViewComponent from "../components/find-center/MapViewComponent";

// MainTabs 높이 + 40px
const MAIN_TABS_HEIGHT = 92;
// 항상 최소한 이 높이까지만 내려가게 함
export const MIN_SHEET_HEIGHT = MAIN_TABS_HEIGHT + 40;

interface HomeScreenProps {
  navigation: RootStackScreenProps<"Home">["navigation"];
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
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

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchSubmit = () => {
    console.log("검색어:", searchTerm);
    // 검색 기능 처리
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

  const { setSelectedCenter } = useContext(MapContext);
  const handleCenterMarkerClick = async (centerId: number) => {
    try {
      const { data, error } = await supabase
        .from("ClimbingCenter")
        .select("*")
        .eq("id", centerId)
        .single(); // 단일 결과를 가져옵니다.

      if (error) {
        console.error("센터 데이터를 가져오는 중 오류 발생:", error);
      } else {
        console.log("선택된 센터 데이터:", data);

        // 선택된 센터 데이터를 MapContext의 selectedCenter에 저장
        setSelectedCenter(data);

        // 선택된 센터 위치로 카메라 이동
        if (mapViewRef.current) {
          mapViewRef.current.animateCameraTo({
            latitude: data.latitude,
            longitude: data.longitude,
            zoom: 16,
            duration: 800, // 카메라 이동 애니메이션 시간 (밀리초)
          });
        }
      }
    } catch (error) {
      console.error("센터 데이터를 가져오는 중 오류 발생:", error);
    }
  };

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

  // 센터 검색 및 선택 시 이동
  const { location: centerLocation, selectedCenter } = useContext(MapContext);

  console.log("selectedCenter", selectedCenter);

  useEffect(() => {
    if (mapViewRef.current) {
      mapViewRef.current.animateCameraTo({
        latitude: centerLocation.latitude,
        longitude: centerLocation.longitude,
        zoom: 16,
        duration: 800,
      });
    }
  }, [centerLocation]);

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
      {/* 검색 바 */}
      <CenterSearchBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
        onClick={() => navigation.navigate("CenterSearch")}
      />

      {/* 지도 */}
      <MapViewComponent
        ref={mapViewRef}
        centers={centers}
        handleCenterMarkerClick={handleCenterMarkerClick}
        location={location}
      />

      <View style={styles.bottomSheetContainer} pointerEvents="box-none">
        <BottomSheetComponent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          renderCenters={renderCenters}
          sheetIndex={sheetIndex}
          handleSheetChanges={handleSheetChanges}
        />
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
  centerName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  centerAddress: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 4,
  },
});
