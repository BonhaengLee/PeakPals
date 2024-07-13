import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { RootStackScreenProps } from "../navigation/types";
import colors from "../styles/colors";

interface ProfileScreenProps {
  navigation: RootStackScreenProps<"Profile">["navigation"];
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const [nickname, setNickname] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={styles.progress} />
      </View>
      <Text style={styles.title}>반가워요!</Text>
      <Text style={styles.subtitle}>
        우선 시작하기 전에 사용할 닉네임과 프로필 이미지를 선택해 주실 수
        있나요?
      </Text>
      <View style={styles.imagePicker}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.addImageText}>+ 사진</Text>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>
          닉네임(최대 8자 한글, 숫자 또는 영문)
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("BodyInfo")}
      >
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
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
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 40,
  },
  progress: {
    width: "33%", // progress percentage
    height: "100%",
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 28,
    color: colors.white,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
    marginVertical: 20,
  },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
  addImageText: {
    color: colors.white,
  },
  inputContainer: {
    width: "100%",
    padding: 10,
    backgroundColor: colors.darkGray,
    borderRadius: 10,
    marginVertical: 10,
  },
  inputText: {
    color: colors.white,
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
});
