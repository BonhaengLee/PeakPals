import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { RootStackScreenProps } from "../navigation/types";
import { colors } from "../styles/colors";
import { supabase } from "../utils/supabase";
import Avatar from "../components/Avatar";
import { TABLES, USER_FIELDS } from "../constants/supabase";

interface ProfileScreenProps {
  navigation: RootStackScreenProps<"Profile">["navigation"];
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const [nickname, setNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const { data, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError.message);
        Alert.alert("User fetching error", userError.message);
        return;
      }

      const user = data.user;
      if (!user) {
        console.error("No user found");
        Alert.alert("No user found");
        return;
      }

      const updates = {
        [USER_FIELDS.ID]: user.id,
        [USER_FIELDS.EMAIL]: user.email,
        [USER_FIELDS.NICKNAME]: nickname,
        [USER_FIELDS.AVATAR_URL]: avatarUrl || null,
        profile_complete: true, // 프로필 설정 완료 표시
      };

      const { data: updateData, error: updateError } = await supabase
        .from(TABLES.USER)
        .upsert(updates)
        .single();

      if (updateError) {
        console.error("Error updating profile:", updateError.message);
        Alert.alert("프로필 업데이트 실패", updateError.message);
      } else {
        console.log("Profile updated successfully", updateData);

        navigation.navigate("HomeStack");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      Alert.alert("Unexpected error", (error as { message: string }).message);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContainer}
      extraHeight={120} // 필요한 경우 여백을 추가해줍니다
    >
      <View style={styles.container}>
        <View style={styles.progressBar}>
          <View style={styles.progress} />
        </View>
        <Text style={styles.title}>반가워요!</Text>
        <Text style={styles.subtitle}>
          우선 시작하기 전에 사용할 닉네임과 프로필 이미지를 선택해 주실 수
          있나요?
        </Text>

        <Avatar
          size={100}
          url={avatarUrl}
          onUpload={(url: string) => setAvatarUrl(url)}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputText}
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임(최대 8자 한글, 숫자 또는 영문)"
            placeholderTextColor={colors.white900}
            maxLength={8}
          />
        </View>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>다음</Text>
        </Pressable>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundBlack,
    padding: 20,
    justifyContent: "center",
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
    color: colors.white1000,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white1000,
    marginVertical: 20,
  },
  inputContainer: {
    width: "100%",
    padding: 10,
    backgroundColor: colors.darkGray,
    borderRadius: 10,
    marginVertical: 10,
  },
  inputText: {
    color: colors.white1000,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20, // 버튼을 입력 칸과 겹치지 않도록 간격을 줌
  },
  buttonText: {
    color: colors.textBlack,
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 20,
    letterSpacing: 0.1,
  },
});
