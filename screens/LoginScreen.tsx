import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { RootStackScreenProps } from "../navigation/types";
import GoogleAuth from "../components/GoogleAuth";
import Auth from "../components/Auth.native";

interface LoginScreenProps {
  navigation: RootStackScreenProps<"Login">["navigation"];
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  return (
    <ImageBackground
      source={require("../assets/images/login/background.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          {/* PeakPals 로그인 페이지 */}
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logoImage}
          />
          {/* 로고 타이틀 */}
          <Text style={styles.logoTitle}>클라이밍에 모든것, PeakPals</Text>
        </View>

        <Auth onLoginSuccess={() => navigation.navigate("Terms")}>
          <GoogleAuth onLoginSuccess={() => navigation.navigate("Terms")} />
        </Auth>
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // 'cover'를 사용하여 이미지가 전체 화면을 덮도록 합니다.
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  logoImage: {
    width: 279,
    height: 56,
    marginBottom: 6,
  },
  logoTitle: {
    fontFamily: "Pretendard",
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 20,
    lineHeight: 28,
  },
});
