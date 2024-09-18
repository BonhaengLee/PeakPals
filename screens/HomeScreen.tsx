import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Linking,
  Button,
} from "react-native";
import * as Location from "expo-location";
import {
  NaverMapView,
  NaverMapViewRef,
  // NaverMapMarker,
} from "@mj-studio/react-native-naver-map";

export default function HomeScreen() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null
  );
  const mapViewRef = useRef<NaverMapViewRef>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        // 위치 권한 요청
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          setLocationPermission(true);
          startTrackingLocation();
        } else if (status === "denied") {
          Alert.alert(
            "권한 거부됨",
            "이 기능을 사용하려면 위치 권한이 필요합니다. 설정에서 권한을 허용해주세요.",
            [
              { text: "취소", style: "cancel" },
              {
                text: "설정 열기",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
          setLocationPermission(false);
        } else {
          setLocationPermission(false);
          Alert.alert(
            "권한 거부됨",
            "이 기능을 사용하려면 위치 권한이 필요합니다."
          );
        }
      } catch (error) {
        console.error("위치 권한 요청 실패:", error);
        setLocationPermission(false);
      }
    };

    const startTrackingLocation = async () => {
      try {
        // 현재 위치 가져오기
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        // 위치 변경 구독
        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 1, // 최소 이동 거리(m)
            timeInterval: 5000, // 최소 시간 간격(ms)
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
      }
    };

    requestLocationPermission();
  }, []);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (location) {
      setLoading(false);
    }
  }, [location]);

  if (locationPermission === null || loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {locationPermission === null
            ? "위치 권한을 요청 중입니다..."
            : "현재 위치를 가져오는 중입니다..."}
        </Text>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  if (locationPermission === false) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          위치 권한이 거부되었습니다. 설정에서 위치 권한을 허용해주세요.
        </Text>
        <Button title="설정 열기" onPress={() => Linking.openSettings()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NaverMapView
        ref={mapViewRef}
        style={{ flex: 1 }}
        center={{
          latitude: location.latitude,
          longitude: location.longitude,
          zoom: 16,
        }}
        onCameraChange={(event) => {
          console.log("Camera Change", event);
        }}
        onMapClick={(event) => {
          console.log("Map Click", event);
        }}
      >
        {/* <NaverMapMarker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          onClick={() => {
            console.log("현재 위치 마커 클릭됨");
          }}
          caption={{
            text: "현재 위치",
          }}
        /> */}
      </NaverMapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
