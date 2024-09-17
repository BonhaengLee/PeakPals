import { useEffect, useState } from "react";
import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";

import { RootStackScreenProps } from "../navigation/types";
import colors from "../styles/colors";
import { supabase } from "../utils/supabase";
import { STORAGE_PATHS, TABLES, USER_FIELDS } from "../constants/supabase";

interface HomeScreenProps {
  navigation: RootStackScreenProps<"Home">["navigation"];
}

export default function HomeOldScreen({ navigation }: HomeScreenProps) {
  const [userProfile, setUserProfile] = useState<{
    id: string;
    nickname: string;
    avatar_url: string;
  } | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError.message);
        return;
      }

      const user = data?.user;
      if (!user) {
        console.error("No user found");
        return;
      }

      const { data: profileData, error } = await supabase
        .from(TABLES.USER)
        .select("*")
        .eq(USER_FIELDS.ID, user.id);

      if (error) {
        console.error("Error fetching profile:", error.message);
      } else if (profileData && profileData.length > 0) {
        setUserProfile(profileData[0]);

        const { data } = await supabase.storage
          .from(STORAGE_PATHS.AVATARS)
          .createSignedUrl(profileData[0].avatar_url, 60); // URL valid for 60 seconds
        console.log(data?.signedUrl);

        setAvatarUrl(data?.signedUrl || null);
      } else {
        console.error("No profile found");
      }
    };

    fetchProfile();
  }, []);

  console.log("home", avatarUrl);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      navigation.navigate("Login");
    }
  };

  if (!userProfile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입을 축하합니다!</Text>
      <Text style={styles.subtitle}>{userProfile.nickname}</Text>
      {avatarUrl ? (
        <Image
          source={{
            uri: avatarUrl,
          }}
          style={styles.avatar}
          onError={() => console.error("Failed to load image:", avatarUrl)}
        />
      ) : (
        <View style={styles.avatarPlaceholder} />
      )}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white1000,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, color: colors.darkGray, marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.lightGray,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.white1000,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 18,
    color: colors.darkGray,
  },
});
