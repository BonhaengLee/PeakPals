import { useEffect, useState } from "react";
import "react-native-url-polyfill/auto";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Text,
} from "react-native";
import { Session } from "@supabase/supabase-js";
import { MaterialIcons, SimpleLineIcons, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import LoginScreen from "./screens/LoginScreen";
import TermsScreen from "./screens/TermsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import { supabase } from "./utils/supabase";
import MyPageScreen from "./screens/MyPageScreen";

import colors from "./styles/colors";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: { marginHorizontal: 8 }, // 각 버튼 사이에 16px 간격 유지
        tabBarIcon: ({ focused }) => {
          if (route.name === "센터 찾기") {
            return (
              <View
                style={[
                  styles.customTabButton,
                  focused && styles.customTabButtonFocused,
                ]}
              >
                <MaterialIcons
                  name="location-searching"
                  size={24}
                  color={focused ? "black" : "gray"}
                />
                <Text
                  style={[
                    styles.customTabButtonText,
                    focused && styles.customTabButtonTextFocused,
                  ]}
                >
                  센터 찾기
                </Text>
              </View>
            );
          }

          if (route.name === "마이페이지") {
            return (
              <View
                style={[
                  styles.customTabButton,
                  focused && styles.customTabButtonFocused,
                ]}
              >
                <Feather
                  name="user"
                  size={24}
                  color={focused ? "black" : "gray"}
                />
                <Text
                  style={[
                    styles.customTabButtonText,
                    focused && styles.customTabButtonTextFocused,
                  ]}
                >
                  마이페이지
                </Text>
              </View>
            );
          }
        },
        tabBarLabel: () => null,
      })}
    >
      <Tab.Screen
        name="센터 찾기"
        component={HomeScreen}
        options={{
          header: () => (
            // ! : react-native-safe-area-context의 SafeAreaView를 사용하여 ios 상단바를 고려한 디자인
            <SafeAreaView style={styles.headerContainer}>
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="센터명 및 위치 검색"
                  placeholderTextColor={colors.black200}
                />
                <TouchableOpacity style={styles.searchIcon}>
                  <SimpleLineIcons name="magnifier" size={24} color="#B6B6B6" />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          ),
        }}
      />
      <Tab.Screen
        name="마이페이지"
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
          headerTitle: "마이페이지",
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
    paddingHorizontal: 8,
  },
  customTabButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    borderRadius: 999,
    marginHorizontal: 8,
  },
  customTabButtonFocused: {
    backgroundColor: "#D0FF00",
  },
  customTabButtonText: {
    color: colors.gray200,
    fontSize: 14,
    marginLeft: 4,
    lineHeight: 24,
  },
  customTabButtonTextFocused: {
    color: "black",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white1000,
    borderRadius: 24,
    flex: 1,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#FFF",
  },
  searchIcon: {
    paddingHorizontal: 16,
  },
});

AppRegistry.registerComponent("main", () => App);
