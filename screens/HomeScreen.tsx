import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Linking,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import WebView from "react-native-webview";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { webviewUrl } from "../utils/config";

export default function HomeScreen() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null
  );
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        let permission;
        if (Platform.OS === "android") {
          permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        } else {
          permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
        }

        const result = await check(permission);

        if (result === RESULTS.GRANTED) {
          setLocationPermission(true);
          startTrackingLocation(); // 권한이 허가된 경우 위치 추적 시작
        } else {
          const requestResult = await request(permission);
          if (requestResult === RESULTS.GRANTED) {
            setLocationPermission(true);
            startTrackingLocation(); // 요청 후 권한이 허가된 경우 위치 추적 시작
          } else if (requestResult === RESULTS.BLOCKED) {
            Alert.alert(
              "Permission Denied",
              "Location permission is required to use this feature. Please enable it in the settings.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Open Settings",
                  onPress: () => Linking.openSettings(),
                },
              ]
            );
          } else {
            setLocationPermission(false);
            Alert.alert(
              "Permission Denied",
              "Location permission is required to use this feature."
            );
          }
        }
      } catch (error) {
        console.error("Failed to request location permission:", error);
        setLocationPermission(false);
      }
    };

    const startTrackingLocation = () => {
      const watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          if (webViewRef.current) {
            webViewRef.current.postMessage(
              JSON.stringify({ latitude, longitude })
            );
          }
        },
        (error) => {
          console.error("Geolocation error:", error.message);
        },
        { enableHighAccuracy: true, distanceFilter: 0, interval: 5000 }
      );

      return () => {
        if (watchId !== null) {
          Geolocation.clearWatch(watchId);
        }
      };
    };

    requestLocationPermission();
  }, []);

  if (locationPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Requesting location permission...
        </Text>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  if (locationPermission === false) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Location permission denied. Please enable location permission in the
          settings.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: webviewUrl }}
        onMessage={(event) => {
          const message = JSON.parse(event.nativeEvent.data);
          console.log("Message received from WebView:", message);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "darkgray",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
