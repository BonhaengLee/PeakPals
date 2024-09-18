import { ExpoConfig, ConfigContext } from "@expo/config";
import * as dotenv from "dotenv";

// initialize dotenv
dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "ho",
  name: "ho",
  plugins: [
    // 1. expo-build-properties 플러그인을 먼저 선언
    [
      "expo-build-properties",
      {
        android: {
          extraMavenRepos: ["https://repository.map.naver.com/archive/maven"],
        },
      },
    ],
    // 2. 네이버 맵 플러그인 선언
    [
      "@mj-studio/react-native-naver-map",
      {
        client_id: process.env.EXPO_PUBLIC_NAVER_MAP_CLIENT_ID,
        android: {
          ACCESS_FINE_LOCATION: true,
          ACCESS_COARSE_LOCATION: true,
          ACCESS_BACKGROUND_LOCATION: true,
        },
        ios: {
          NSLocationAlwaysAndWhenInUseUsageDescription:
            "앱이 위치 정보를 사용합니다.",
          NSLocationWhenInUseUsageDescription: "앱이 위치 정보를 사용합니다.",
          NSLocationTemporaryUsageDescriptionDictionary: {
            purposeKey: "location",
            usageDescription: "앱이 위치 정보를 사용합니다.",
          },
        },
      },
    ],
    // 3. 기타 필요한 플러그인 선언
    "@react-native-google-signin/google-signin",
    "expo-apple-authentication",
    "expo-location",
  ],
});
