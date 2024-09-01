import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Linking,
  NativeSyntheticEvent,
  Button,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { useNavigation } from "@react-navigation/native";
import { WebViewErrorEvent } from "react-native-webview/lib/RNCWebViewNativeComponent";

import { webviewUrl } from "../utils/config";

const HomeScreen = forwardRef((props, ref) => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null
  );
  const webViewRef = useRef<WebView>(null);
  const navigation = useNavigation();

  useImperativeHandle(ref, () => ({
    reloadWebView: () => {
      if (webViewRef.current) {
        webViewRef.current.reload();
      }
    },
  }));

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

  const [webViewKey, setWebViewKey] = useState<number>(0); // 웹뷰의 키 상태
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);

  // 웹뷰 로딩 중 표시
  const handleLoadStart = () => {
    setLoading(true);
    setLoadError(false);
  };

  // 웹뷰 로딩 완료 처리
  const handleLoadEnd = () => {
    setLoading(false);
  };

  // 웹뷰 오류 처리
  const handleWebViewError = (
    syntheticEvent: NativeSyntheticEvent<WebViewErrorEvent>
  ) => {
    const { nativeEvent } = syntheticEvent;
    console.error("WebView error: ", nativeEvent);
    setLoadError(true);
    setLoading(false);
  };

  // 헤더 변경
  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    const message = JSON.parse(event.nativeEvent.data);
    if (message.type === "CENTER_SELECTED") {
      const { centerName } = message.data;

      // 헤더를 선택된 센터 이름으로 변경
      navigation.setOptions({
        title: centerName,
        headerLeft: () => (
          <Text onPress={() => navigation.goBack()} style={styles.backButton}>
            뒤로가기
          </Text>
        ),
      });
    }
  };

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

  // 웹뷰 로드 에러
  if (loadError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Unable to load the content. Please check your connection.
        </Text>
        <Button
          title="Retry"
          onPress={() => setWebViewKey((prevKey) => prevKey + 1)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="gray" />
        </View>
      )}

      <WebView
        key={webViewKey} // 키를 추가하여 리로드 처리
        startInLoadingState={true}
        cacheEnabled={true}
        cacheMode="LOAD_DEFAULT"
        renderLoading={() => (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="gray" />
          </View>
        )}
        ref={webViewRef}
        source={{ uri: webviewUrl }}
        onMessage={handleWebViewMessage}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleWebViewError}
      />
    </View>
  );
});

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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    color: "blue",
    paddingLeft: 10,
    paddingTop: 10,
    fontSize: 16,
  },
});

export default HomeScreen;
