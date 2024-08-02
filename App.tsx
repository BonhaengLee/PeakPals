import { useEffect, useState } from "react";
import "react-native-url-polyfill/auto";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import { getKeyHashAndroid } from "@react-native-kakao/core";
import { Session } from "@supabase/supabase-js";

import LoginScreen from "./screens/LoginScreen";
import TermsScreen from "./screens/TermsScreen";
import ProfileScreen from "./screens/ProfileScreen";
// import BodyInfoScreen from "./screens/BodyInfoScreen";
import { kakaoNativeAppKey } from "./utils/config";
import HomeScreen from "./screens/HomeScreen";
import { supabase } from "./utils/supabase";
// import CenterSearchScreen from "./screens/CenterSearchScreen";

initializeKakaoSDK(kakaoNativeAppKey);

getKeyHashAndroid().then(console.log);

const Stack = createStackNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={session ? "Home" : "Login"}>
          {session ? (
            <>
              <Stack.Screen
                name="Terms"
                component={TermsScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ headerShown: false }}
              />
              {/* <Stack.Screen
            name="BodyInfo"
            component={BodyInfoScreen} // 새로운 화면 컴포넌트 추가
            options={{ headerShown: false }}
          /> */}
              {/* <Stack.Screen
            name="CenterSearch"
            component={CenterSearchScreen} // 새로운 화면 컴포넌트 추가
            options={{ headerShown: false }}
          /> */}
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

AppRegistry.registerComponent("main", () => App);
