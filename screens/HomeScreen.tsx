import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { RootStackScreenProps } from "../navigation/types";
import colors from "../styles/colors";
import { supabase } from "../utils/supabase";

interface HomeScreenProps {
  navigation: RootStackScreenProps<"Home">["navigation"];
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError.message);
        return;
      }

      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        if (error) {
          console.error("Error fetching profile:", error.message);
        } else {
          setUserProfile(data);
        }
      }
    };

    fetchProfile();
  }, []);

  if (!userProfile) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입을 축하합니다!</Text>
      <Text style={styles.subtitle}>{userProfile.nickname}</Text>
      {userProfile.avatar_url && (
        <Image
          source={{
            uri: `YOUR_SUPABASE_STORAGE_URL/avatars/${userProfile.avatar_url}`,
          }}
          style={styles.avatar}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  subtitle: { fontSize: 18, color: colors.darkGray },
});
