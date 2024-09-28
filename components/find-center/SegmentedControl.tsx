import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";

import { colors } from "../../styles/colors";

export const SegmentedControl = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: Function;
}) => {
  return (
    <View style={styles.segmentedControl}>
      <Pressable
        style={[
          styles.segmentButton,
          activeTab === "saved" && styles.activeSegment,
        ]}
        onPress={() => setActiveTab("saved")}
      >
        <Text
          style={[
            styles.segmentButtonText,
            activeTab === "saved" && styles.activeSegmentText,
          ]}
        >
          저장된 센터
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.segmentButton,
          activeTab === "nearby" && styles.activeSegment,
        ]}
        onPress={() => setActiveTab("nearby")}
      >
        <Text
          style={[
            styles.segmentButtonText,
            activeTab === "nearby" && styles.activeSegmentText,
          ]}
        >
          내 주변 센터
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  segmentedControl: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: colors.ui03,
    color: colors.coreSecondary,
  },
  segmentButtonLeft: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  segmentButtonRight: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  segmentButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text02,
  },
  activeSegment: {
    backgroundColor: colors.primary,
  },
  activeSegmentText: {
    color: colors.textBlack,
  },
});
