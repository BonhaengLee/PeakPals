import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { RootStackScreenProps } from "../navigation/types";
import colors from "../styles/colors";

interface BodyInfoScreenProps {
  navigation: RootStackScreenProps<"BodyInfo">["navigation"];
}

export default function BodyInfoScreen({ navigation }: BodyInfoScreenProps) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>←</Text>
      </TouchableOpacity>
      <View style={styles.progressBar}>
        <View style={styles.progress} />
      </View>
      <Text style={styles.title}>그리고</Text>
      <Text style={styles.subtitle}>
        간단한 신체 정보를 작성해 주세요
        {"\n"}
        저희가 클라이밍을 더 잘할 수 있게 도와 드려요!
      </Text>
      <Text style={styles.infoText}>이 정보가 왜 필요한가요?</Text>
      <TextInput
        style={styles.input}
        placeholder="키(cm)"
        placeholderTextColor={colors.white}
        value={height}
        onChangeText={setHeight}
      />
      <TextInput
        style={styles.input}
        placeholder="몸무게(kg)"
        placeholderTextColor={colors.white}
        value={weight}
        onChangeText={setWeight}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("CenterSearch")}>
        <Text style={styles.skipText}>건너뛰기</Text>
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
  backButton: {
    fontSize: 24,
    color: colors.white,
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
    width: "50%", // progress percentage
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
  infoText: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    backgroundColor: colors.darkGray,
    borderRadius: 10,
    marginVertical: 10,
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
  skipText: {
    color: colors.lightGray,
    position: "absolute",
    bottom: 20,
  },
});
