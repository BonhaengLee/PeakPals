import { TouchableOpacity } from "react-native-gesture-handler";
import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import MyPageScreen from "../screens/MyPageScreen";
import { colors } from "../styles/colors";

const Tab = createBottomTabNavigator();
function MainTabs() {
  const homeScreenRef = useRef<{ reloadWebView: () => void } | null>(null);

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
            const label = options.tabBarLabel || route.name;

            const onPress = () => {
              const isFocused = state.index === index;

              if (isFocused && route.name === "센터 찾기") {
                // 탭이 두 번 눌렸을 때 웹뷰를 리로드
                homeScreenRef.current?.reloadWebView();
              } else {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={{ flex: 1 }}
              >
                <Text style={styles.tabBarLabel}>{String(label)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    >
      <Tab.Screen
        name="센터 찾기"
        options={{ headerShown: false }}
        children={() => <HomeScreen ref={homeScreenRef} />}
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

export default MainTabs;

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
