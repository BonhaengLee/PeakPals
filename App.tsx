import { useEffect, useState } from "react";
import "react-native-url-polyfill/auto";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  AppRegistry,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import { getKeyHashAndroid } from "@react-native-kakao/core";
import { Session } from "@supabase/supabase-js";

import LoginScreen from "./screens/LoginScreen";
import TermsScreen from "./screens/TermsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import { supabase } from "./utils/supabase";
// import CenterSearchScreen from "./screens/CenterSearchScreen";
import MyPageScreen from "./screens/MyPageScreen";

import { kakaoNativeAppKey } from "./utils/config";
import colors from "./styles/colors";

initializeKakaoSDK(kakaoNativeAppKey);

getKeyHashAndroid().then(console.log);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen name="센터 찾기" component={HomeScreen} />
      {/* <Tab.Screen name={"Peak-Pals"} component={MyPageScreen} /> */}
      <Tab.Screen
        name={"Peak-Pals"}
        component={MyPageScreen}
        options={{
          headerStyle: {
            backgroundColor: "#000000", // 헤더의 배경색 설정

            // borderBottom 표시
            borderBottomColor: colors.black600,
            shadowColor: "transparent",
            borderBottomWidth: 1,
          },
          headerTintColor: "#FFFFFF", // 헤더 내 텍스트와 아이콘 색상 설정
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: "bold",
          },
          headerTitleAlign: "left",
          headerTitle: "Peak-Pals",
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // 현재 세션 정보를 가져옵니다.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    // 세션 상태 변경을 감지합니다.
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={session ? "HomeStack" : "Login"}>
          {session ? (
            <>
              <Stack.Screen
                name="HomeStack"
                component={HomeStack}
                options={{ headerShown: false }}
              />
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

// HomeStack은 Stack.Navigator를 사용하여 MainTabs와 다른 화면을 포함하는 네비게이터를 정의
function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="MainTabs">
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
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
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#000000",
    borderTopWidth: 1,
    borderTopColor: "#333333",
    height: 60,
  },
  tabBarLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

AppRegistry.registerComponent("main", () => App);
