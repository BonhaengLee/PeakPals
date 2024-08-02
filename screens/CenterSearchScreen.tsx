import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { RootStackScreenProps } from "../navigation/types";
import colors from "../styles/colors";

interface CenterSearchScreenProps {
  navigation: RootStackScreenProps<"CenterSearch">["navigation"];
}

export default function CenterSearchScreen({
  navigation,
}: CenterSearchScreenProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>←</Text>
      </TouchableOpacity>
      <View style={styles.progressBar}>
        <View style={styles.progress} />
      </View>
      <Text style={styles.title}>마지막으로</Text>
      <Text style={styles.subtitle}>
        자주 다니는 클라이밍 센터가 있나요?
        {"\n"}
        저희가 실시간으로 소식을 알려 드려요!
      </Text>
      <Text style={styles.infoText}>내가 찾는 센터가 없나요?</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="센터 이름 또는 위치 검색"
          placeholderTextColor={colors.white1000}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text style={styles.skipText}>건너뛰기</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundBlack,
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    fontSize: 24,
    color: colors.white1000,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    overflow: "hidden",
  },
  progress: {
    width: "100%", // progress percentage
    height: "100%",
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 28,
    color: colors.white1000,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white1000,
    textAlign: "center",
    marginVertical: 20,
  },
  infoText: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    padding: 10,
    backgroundColor: colors.darkGray,
    borderRadius: 10,
    marginVertical: 10,
  },
  input: {
    color: colors.white1000,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
  },
  buttonText: {
    color: colors.textBlack,
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  skipText: {
    color: colors.lightGray,
    position: "absolute",
    bottom: 20,
  },
});
