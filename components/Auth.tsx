import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { login as kakaoLogin } from "@react-native-kakao/user";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { supabase } from "../utils/supabase";
import { googleIosClientId, googleWebClientId } from "../utils/config";

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
      const { idToken } = userInfo;
      console.log("Google login success", JSON.stringify(userInfo, null, 2));

      if (idToken) {
        console.log("Id Token present, attempting Supabase sign-in...");
        const {
          data: { user, session },
          error: signError,
        } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: idToken,
        });
        console.log("Supabase sign-in response: ");
        console.log("User: ", user);
        console.log("Session: ", session);

        // 로그인 성공 시 약관 동의 페이지로 이동
        if (user) {
          const { id, email } = user;
          const { data: upsertData, error: upsertError } = await supabase
            .from("users")
            .upsert([{ id, email }]);

          // upsertData와 upsertError를 확인하여 로그인 성공 여부를 확인합니다.
          console.log("User upsert response: ", upsertData);

          if (upsertError) {
            console.error("Error upserting user:", upsertError.message);
            console.log(
              "Full error object:",
              JSON.stringify(upsertError, null, 2)
            );
          } else {
            console.log("User upsert response: ", upsertData);
            onLoginSuccess();
          }
        }
        if (signError) console.error("Error signing in:", signError.message);
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
      console.log("Kakao Sign-In button pressed");
      const userInfo = await kakaoLogin();
      const { accessToken } = userInfo;
      console.log("Kakao login success", JSON.stringify(userInfo, null, 2));

      if (accessToken) {
        console.log(
          "Kakao login token present, attempting Supabase sign-in..."
        );
        const { data, error: signError } = await supabase.auth.signInWithOAuth({
          provider: "kakao",
        });

        if (signError) throw signError;

        console.log("Supabase sign-in response: ", data);

        // 로그인 성공 시 약관 동의 페이지로 이동
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Error fetching user:", userError.message);
          return;
        }

        if (user) {
          const { id, email } = user;
          const { data: upsertData, error: upsertError } = await supabase
            .from("users")
            .upsert([{ id, email }]);

          // upsertData와 upsertError를 확인하여 로그인 성공 여부를 확인합니다.
          console.log("User upsert response: ", upsertData);

          if (upsertError) {
            console.error("Error upserting user:", upsertError.message);
            console.log(
              "Full error object:",
              JSON.stringify(upsertError, null, 2)
            );
          } else {
            console.log("User upsert response: ", upsertData);
            onLoginSuccess();
          }
        }
      } else {
        throw new Error("No Kakao login token present!");
      }
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
