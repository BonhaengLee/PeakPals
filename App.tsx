import React, { useEffect, useState } from "react";
import { AppRegistry, StyleSheet, Text, Pressable } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Session } from "@supabase/supabase-js";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { supabase } from "./utils/supabase";
import LoginScreen from "./screens/LoginScreen";
import TermsScreen from "./screens/TermsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import MyPageScreen from "./screens/MyPageScreen";
import { TABLES, USER_FIELDS } from "./constants/supabase";
import { colors } from "./styles/colors";

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
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          if (route.name === "센터 찾기") {
            return (
              <MaterialCommunityIcons
                name="text-search"
                size={24}
                color={focused ? colors.backgroundBlack : colors.text02}
              />
            );
          } else if (route.name === "마이페이지") {
            return (
              <Feather
                name="user"
                size={24}
                color={focused ? colors.backgroundBlack : colors.text02}
              />
            );
          }
        },
        tabBarLabel: ({ focused }) => {
          let label;
          if (route.name === "센터 찾기") {
            label = "센터 찾기";
          } else if (route.name === "마이페이지") {
            label = "마이페이지";
          }

          return (
            <Text
              style={[
                styles.tabBarLabel,
                focused ? styles.activeLabel : styles.inactiveLabel,
              ]}
            >
              {label}
            </Text>
          );
        },
        tabBarButton: (props) => (
          <Pressable
            {...props}
            style={[
              props.style,
              props.accessibilityState?.selected
                ? styles.activeTabItem
                : styles.inactiveTabItem,
            ]}
          />
        ),
        tabBarStyle: [
          styles.tabBar,
          {
            paddingBottom: 24, // 안전한 하단 패딩 추가
            height: 60 + 32, // 하단 패딩을 고려한 높이
          },
        ],
        tabBarItemStyle: styles.tabItem,
      })}
    >
      <Tab.Screen
        name="센터 찾기"
        options={{ headerShown: false }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="마이페이지"
        component={MyPageScreen}
        options={{
          headerStyle: {
            backgroundColor: colors.backgroundBlack,
            borderBottomColor: colors.black600,
            shadowColor: "transparent",
            borderBottomWidth: 1,
          },
          headerTintColor: colors.white1000,
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: "bold",
          },
          headerTitleAlign: "left",
          headerTitle: "마이페이지",
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
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) {
          console.error("세션 로드 오류:", sessionError);
        }

        const currentSession = sessionData?.session;
        setSession(currentSession);

        if (currentSession) {
          const { data: profileData, error: profileError } = await supabase
            .from(TABLES.USER)
            .select("terms_agreed, profile_complete")
            .eq(USER_FIELDS.ID, currentSession.user.id)
            .maybeSingle();

          if (profileError) {
            console.error(
              "프로필을 가져오는 중 오류 발생:",
              profileError.message
            );
            setInitialRoute("Login");
          } else if (!profileData?.terms_agreed) {
            setInitialRoute("Terms");
          } else if (!profileData?.profile_complete) {
            setInitialRoute("Profile");
          } else {
            setInitialRoute("HomeStack");
          }
        } else {
          setInitialRoute("Login");
        }
      } catch (err) {
        console.error("세션 로딩 중 오류 발생:", err);
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

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
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
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
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
    flexDirection: "row",
    backgroundColor: colors.backgroundBlack,
    borderTopWidth: 1,
    borderTopColor: "#333333",
    height: 76,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 24,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "normal",
    textAlign: "center",
  },
  activeTabItem: {
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
  inactiveTabItem: {
    backgroundColor: colors.backgroundBlack,
  },
  activeLabel: {
    color: colors.backgroundBlack,
  },
  inactiveLabel: {
    color: colors.text02,
  },
});

AppRegistry.registerComponent("main", () => App);
