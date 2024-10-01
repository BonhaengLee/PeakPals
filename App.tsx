import React, { useEffect, useState } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  Pressable,
  StatusBar,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Session } from "@supabase/supabase-js";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { supabase } from "./utils/supabase";
import LoginScreen from "./screens/LoginScreen";
import TermsScreen from "./screens/TermsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import MyPageScreen from "./screens/MyPageScreen";
import { TABLES, USER_FIELDS } from "./constants/supabase";
import { colors } from "./styles/colors";
import CenterSearchScreen from "./screens/CenterSearchScreen";
import { MapProvider } from "./context/MapContext";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
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
            paddingBottom: 24,
            height: 60 + 32,
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
    <>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <MapProvider>
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
              </MapProvider>
            </BottomSheetModalProvider>
          </SafeAreaView>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerMode: "screen", // 스크린 별로 헤더를 각각 관리하도록 설정
      }}
    >
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
      <Stack.Screen
        name="CenterSearch"
        component={CenterSearchScreen} // 검색 화면 추가
        options={{
          title: "센터 검색",
          headerShown: false,
          gestureDirection: "vertical", // 스와이프 제스처 방향 설정 (아래에서 위)
          cardStyleInterpolator:
            TransitionPresets.ModalSlideFromBottomIOS.cardStyleInterpolator, // 아래에서 위로 열리는 애니메이션 적용
          transitionSpec: {
            open: {
              animation: "timing",
              config: {
                duration: 10, // 열리는 애니메이션 속도 (ms 단위, 기본 500ms)
              },
            },
            close: {
              animation: "timing",
              config: {
                duration: 10, // 닫히는 애니메이션 속도
              },
            },
          },
          // !: Nested Screen Header
          // headerShown: true,
          // headerStyle: {
          //   backgroundColor: colors.backgroundBlack,
          //   height: 56,
          // },
          // headerTintColor: colors.white1000,
          // headerTitleStyle: {
          //   fontSize: 18,
          //   fontWeight: "bold",
          // },
          // headerTitleAlign: "center",
          // headerStatusBarHeight: 0, // 상태바 높이를 0으로 설정하여 추가 여백 제거
        }}
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
