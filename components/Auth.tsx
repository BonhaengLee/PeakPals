import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { supabase } from "../utils/supabase";
import { googleIosClientId, googleWebClientId } from "../utils/config";

export default function () {
  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
    webClientId: googleWebClientId, // client ID of type WEB for your server (needed to verify user ID and offline access)
    iosClientId: googleIosClientId,
    offlineAccess: false,
  });

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          console.log("Google Sign-In button pressed");
          await GoogleSignin.hasPlayServices();
          console.log("Play Services available, attempting sign-in...");
          const userInfo = await GoogleSignin.signIn();
          console.log(JSON.stringify(userInfo, null, 2));

          if (userInfo.idToken) {
            console.log("Id Token present, attempting Supabase sign-in...");
            // const { data, error };  = await supabase.auth.signInWithIdToken({
            const d = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: userInfo.idToken,
            });
            // console.log(error, data);
            // if (error) {
            //   console.error("Supabase signInWithIdToken error:", error);
            // } else {
            //   console.log("Supabase signInWithIdToken success:", data);
            // }
            console.log("Supabase sign-in response: ", d);
            console.log("User: ", d.data.user);
            console.log("Session: ", d.data.session);
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
      }}
    />
  );
}
