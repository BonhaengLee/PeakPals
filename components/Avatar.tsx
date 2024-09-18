import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { supabase } from "../utils/supabase";
import { colors } from "../styles/colors";
import { STORAGE_PATHS } from "../constants/supabase";

interface Props {
  size: number;
  url: string | null;
  onUpload: (filePath: string) => void;
}

export default function Avatar({ url, size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size, borderRadius: size / 2 };

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_PATHS.AVATARS)
        .download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("User cancelled image picker.");
        return;
      }

      const image = result.assets[0];
      console.log("Got image", image);

      if (!image.uri) {
        throw new Error("No image uri!");
      }

      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer()
      );

      const fileExt = image.uri.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from(STORAGE_PATHS.AVATARS)
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/jpeg",
        });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(data.path);
      setAvatarUrl(image.uri);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.imagePicker, avatarSize]}
        onPress={uploadAvatar}
        disabled={uploading}
      >
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={[styles.avatar, avatarSize]}
          />
        ) : (
          <View style={[styles.imagePlaceholder, avatarSize]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addButton}
        onPress={uploadAvatar}
        disabled={uploading}
      >
        <Text style={styles.addImageText}>+ 사진</Text>
      </TouchableOpacity>
      {uploading && <Text style={styles.uploadingText}>Uploading...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    borderRadius: 50,
  },
  imagePlaceholder: {
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    marginTop: -20,
    backgroundColor: colors.white900,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addImageText: {
    color: colors.textBlack,
  },
  uploadingText: {
    marginTop: 10,
    color: colors.white1000,
  },
  placeholderText: {
    color: colors.white1000,
  },
});
