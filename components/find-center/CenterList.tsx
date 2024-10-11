import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";

import { SavedCenter, SimplifiedCenter } from "../../types";

export const renderSavedCenters = (centers: SavedCenter[]) => {
  return centers.map((center, index) => (
    <View key={index} style={styles.centerContainer}>
      <View>
        <Text style={styles.centerName}>{center.name}</Text>
        <Text style={styles.centerAddress}>{center.address}</Text>
        <View style={styles.visitCountContainer}>
          <Text style={styles.visitCountText}>{center.visitCount}번 방문</Text>
        </View>
      </View>
      <Image
        style={styles.starIcon}
        source={require("../../assets/images/maps/filledStar.png")}
      />
    </View>
  ));
};

export const renderNearbyCenters = (
  centers: SimplifiedCenter[],
  handleCenterMarkerClick: (centerId: number) => void
) => {
  return centers.map((center, index) => (
    <Pressable
      key={center.id}
      onPress={() => handleCenterMarkerClick(center.id)} // 센터 클릭 시 handleCenterMarkerClick 호출
      style={styles.centerContainer}
    >
      <View>
        <Text style={styles.centerName}>{center.name}</Text>
        <Text style={styles.centerAddress}>{center.address}</Text>
      </View>
    </Pressable>
  ));
};

const styles = StyleSheet.create({
  centerContainer: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  centerName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  centerAddress: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
  },
  visitCountContainer: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 1,
    borderRadius: 16,
  },
  visitCountText: {
    color: "white",
    fontSize: 14,
  },
  starIcon: {
    width: 32,
    height: 32,
  },
});
