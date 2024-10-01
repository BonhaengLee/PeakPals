import React from "react";
import {
  ActivityIndicator,
  Text,
  Pressable,
  View,
  StyleSheet,
} from "react-native";

export const RenderLocationError = ({
  locationError,
  retryFunction,
}: {
  locationError: string | null;
  retryFunction: () => void;
}) => {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>
        {locationError || "현재 위치를 가져오는 중입니다..."}
      </Text>
      {locationError && (
        <Pressable
          onPress={() => {
            retryFunction();
          }}
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </Pressable>
      )}
      {!locationError && <ActivityIndicator size="large" color="gray" />}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#007AFF",
    borderRadius: 6,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
