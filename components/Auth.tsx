import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { supabase } from "../utils/supabase";

export default function () {
  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
    webClientId:
      "166518374258-p0p4gqpmjq4ijbqfrqrjsub4me72c61a.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
  });

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          console.log(JSON.stringify(userInfo, null, 2));

          if (userInfo.idToken) {
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
            console.log(d.data.user, d.data.session);
          } else {
            throw new Error("No Id Token present!");
          }
        } catch (error: unknown) {
          if (
            (
              error as {
                code: string;
              }
            ).code === statusCodes.SIGN_IN_CANCELLED
          ) {
            // user cancelled the login flow
          } else if (
            (
              error as {
                code: string;
              }
            ).code === statusCodes.IN_PROGRESS
          ) {
            // operation (e.g. sign in) is in progress already
          } else if (
            (
              error as {
                code: string;
              }
            ).code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
          ) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      }}
    />
  );
}
