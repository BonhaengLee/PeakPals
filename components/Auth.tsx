import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { login as kakaoLogin } from "@react-native-kakao/user";

import { supabase } from "../utils/supabase";
import { googleIosClientId, googleWebClientId } from "../utils/config";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface AuthProps {
  onLoginSuccess: () => void;
}

export default function ({ onLoginSuccess }: AuthProps) {
  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
    webClientId: googleWebClientId, // client ID of type WEB for your server (needed to verify user ID and offline access)
    iosClientId: googleIosClientId,
    offlineAccess: false,
  });

  const handleGoogleSignIn = async () => {
    try {
      console.log("Google Sign-In button pressed");
      await GoogleSignin.hasPlayServices();
      console.log("Play Services available, attempting sign-in...");
      const userInfo = await GoogleSignin.signIn();
      console.log(JSON.stringify(userInfo, null, 2));

      if (userInfo.idToken) {
        console.log("Id Token present, attempting Supabase sign-in...");
        const d = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.idToken,
        });
        console.log("Supabase sign-in response: ", d);
        console.log("User: ", d.data.user);
        console.log("Session: ", d.data.session);

        // 로그인 성공 시 약관 동의 페이지로 이동
        onLoginSuccess();
      } else {
        throw new Error("No Id Token present!");
      }
    } catch (error: unknown) {
      console.error("Sign-In error: ", error);
      const err = error as Error & {
        code: string;
        message: string;
      };
      if (err.code) {
        console.error("Error code: ", err.code);
      }
      if (err.message) {
        console.error("Error message: ", err.message);
      }
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled the login flow");
      } else if (err.code === statusCodes.IN_PROGRESS) {
        console.log("Sign in is in progress already");
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play services not available or outdated");
      } else {
        console.error("Some other error happened:", err);
      }
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const token = await kakaoLogin();
      console.log("Kakao login success", token);

      // 추가적인 로직이 필요하면 여기에 작성합니다.
      onLoginSuccess();
    } catch (error) {
      console.error("Kakao login error: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <GoogleSigninButton
        style={styles.googleButton}
        size={GoogleSigninButton.Size.Icon}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleSignIn}
      />
      <Pressable style={styles.kakaoButton} onPress={handleKakaoLogin}>
        <Image
          source={require("../assets/images/login/kakao.png")}
          style={styles.kakao}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20, // 필요한 경우 상단 여백 추가
  },
  googleButton: {
    width: 54,
    height: 54,
    marginRight: 10,
  },
  kakaoButton: {},
  kakao: {
    borderWidth: 1,
    borderRadius: 40,
    width: 44,
    height: 44,
  },
});
