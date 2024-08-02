import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Button,
  TextInput,
  Image,
} from "react-native";
import { Session } from "@supabase/supabase-js";

import { supabase } from "../utils/supabase";
import { STORAGE_PATHS, TABLES, USER_FIELDS } from "../constants/supabase";

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data: user, error } = await supabase
        .from(TABLES.USER)
        .select("nickname, avatar_url")
        .eq(USER_FIELDS.ID, session.user.id)
        .single();

      if (error) throw error;

      if (user) {
        setUsername(user.nickname);
        if (user.avatar_url) {
          const { data } = supabase.storage
            .from(STORAGE_PATHS.AVATARS)
            .getPublicUrl(user.avatar_url);
          setAvatarUrl(data.publicUrl);
        } else {
          setAvatarUrl("");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session.user.id,
        nickname: username,
        avatar_url,
      };

      let { error } = await supabase.from(TABLES.USER).upsert(updates);

      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          placeholder="Email"
          value={session?.user?.email}
          editable={false}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          placeholder="Username"
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          placeholder="Avatar URL"
          value={avatarUrl || ""}
          onChangeText={(text: string) => setAvatarUrl(text)}
        />
      </View>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : null}
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? "Loading ..." : "Update"}
          onPress={() => updateProfile({ username, avatar_url: avatarUrl })}
          disabled={loading}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
  },
});
