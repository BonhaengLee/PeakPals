import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { RootStackScreenProps } from "../navigation/types";
import colors from "../styles/colors";
import { supabase } from "../utils/supabase";

interface ProfileScreenProps {
  navigation: RootStackScreenProps<"Profile">["navigation"];
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError.message);
      return;
    }

    if (user) {
      let avatar_url: string = "";
      if (avatar) {
        const fileExt = avatar.split(".").pop();
        const fileName = `${user.id}.${fileExt}`;
        const filePath = `${fileName}`;

        let { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatar);

        if (uploadError) {
          console.error(uploadError);
        } else {
          avatar_url = filePath;
        }
      }

      const { data, error } = await supabase
        .from("users")
        .update({ nickname, avatar_url })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating profile:", error.message);
      } else {
        navigation.navigate("Home");
      }
    }
  };

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
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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
