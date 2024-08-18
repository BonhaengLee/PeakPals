import { useEffect, useState } from "react";
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import WebView from "react-native-webview";

import { RootStackScreenProps, ScreenNames } from "../navigation/types";
import { useSessionAndProfile } from "../hooks/useSessionAndProfile";

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
  const [webViewRef, setWebViewRef] = useState<WebView | null>(null);

  useSessionAndProfile({
    setInitialRoute: (routeName: ScreenNames) => {
      navigation.navigate(routeName as any);
    },
  });

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === "android") {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setLocationPermission(true);
          } else {
            setLocationPermission(false);
            Alert.alert(
              "Permission Denied",
              "Location permission is required to use this feature."
            );
          }
        } else {
          const status = await Geolocation.requestAuthorization("whenInUse");
          if (status === "granted") {
            setLocationPermission(true);
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

    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (locationPermission === true && webViewRef) {
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
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
