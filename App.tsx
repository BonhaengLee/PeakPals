import React, { useEffect, useRef, useState } from "react";
import { AppRegistry, Pressable, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Session } from "@supabase/supabase-js";

import { supabase } from "./utils/supabase";
import LoginScreen from "./screens/LoginScreen";
import TermsScreen from "./screens/TermsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import MyPageScreen from "./screens/MyPageScreen";
import { TABLES, USER_FIELDS } from "./constants/supabase";

import colors from "./styles/colors";

import { WebView } from "react-native-webview";
import { Platform } from "react-native";

// if (Platform.OS === "android") {
//   WebView.setWebContentsDebuggingEnabled(true);
// }

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  // const homeScreenRef = useRef<{ reloadWebView: () => void } | null>(null);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
      tabBar={({ state, descriptors, navigation }) => (
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            // const onPress = () => {
            //   if (isFocused && route.name === "센터 찾기") {
            //     homeScreenRef.current?.reloadWebView();
            //   } else {
            //     navigation.navigate(route.name);
            //   }
            // };

            return (
              <Pressable
                key={route.key}
                // onPress={onPress}
                style={[
                  styles.tabItem,
                  {
                    backgroundColor: isFocused ? colors.gray500 : "transparent",
                  },
                ]}
              >
                <Text style={styles.tabBarLabel}>{String(label)}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    >
      <Tab.Screen
        name="센터 찾기"
        options={{ headerShown: false }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="Peak-Pals"
        component={MyPageScreen}
        options={{
          headerStyle: {
            backgroundColor: "#000000",
            borderBottomColor: colors.black600,
            shadowColor: "transparent",
            borderBottomWidth: 1,
          },
          headerTintColor: "#FFFFFF",
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
  const [initialRoute, setInitialRoute] = useState<
    "Login" | "Terms" | "Profile" | "HomeStack"
  >("Login");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentSession = sessionData?.session;
      setSession(currentSession);

      if (currentSession) {
        const { data: profileData, error } = await supabase
          .from(TABLES.USER)
          .select("terms_agreed, profile_complete")
          .eq(USER_FIELDS.ID, currentSession.user.id)
          .single();

        if (error) {
          console.error("프로필을 가져오는 중 오류 발생:", error.message);
          setInitialRoute("Login");
        } else {
          if (!profileData?.terms_agreed) {
            setInitialRoute("Terms");
          } else if (!profileData?.profile_complete) {
            setInitialRoute("Profile");
          } else {
            setInitialRoute("HomeStack");
          }
        }
      } else {
        setInitialRoute("Login");
      }
      setIsLoading(false);
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
          setInitialRoute("Login");
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <GestureHandlerRootView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>로딩 중...</Text>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
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
    flexDirection: "row", // 탭 아이템들이 가로로 나열되도록 설정
    backgroundColor: "#000000",
    borderTopWidth: 1,
    borderTopColor: "#333333",
    height: 60,
  },
  tabItem: {
    flex: 1, // 탭 아이템이 동일한 너비를 차지하도록 설정
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

AppRegistry.registerComponent("main", () => App);
