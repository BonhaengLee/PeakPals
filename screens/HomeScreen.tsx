import { useEffect, useState } from "react";
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  Text,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import WebView from "react-native-webview";

import { RootStackScreenProps } from "../navigation/types";

interface HomeScreenProps {
  navigation: RootStackScreenProps<"Home">["navigation"];
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [webViewRef, setWebViewRef] = useState<WebView | null>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setLocationPermission(true);
        } else {
          Alert.alert(
            "Permission Denied",
            "Location permission is required to use this feature."
          );
        }
      } else {
        // iOS에서는 위치 서비스가 활성화되어 있는지 확인합니다.
        Geolocation.requestAuthorization("whenInUse").then((status) => {
          if (status === "granted") {
            setLocationPermission(true);
          } else {
            Alert.alert(
              "Permission Denied",
              "Location permission is required to use this feature."
            );
          }
        });
      }
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (locationPermission && webViewRef) {
      const watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          if (webViewRef) {
            webViewRef.postMessage(JSON.stringify({ latitude, longitude }));
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
    }
  }, [locationPermission, webViewRef]);

  if (!locationPermission) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Requesting location permission...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={(ref) => setWebViewRef(ref)}
        source={{ uri: "https://your-webview-url.com" }}
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
  },
});
