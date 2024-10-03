import { StyleSheet, View } from "react-native";

function SkeletonCenterDetails() {
  return (
    <View style={styles.centerDetailContainer}>
      <View style={styles.skeletonBox} />

      <View style={styles.skeletonBoxSmall} />

      <View style={styles.skeletonButtonRow}>
        <View style={styles.skeletonButton} />
        <View style={styles.skeletonButton} />
        <View style={styles.skeletonButton} />
      </View>

      <View style={styles.skeletonBox} />
      <View style={styles.skeletonBoxSmall} />
    </View>
  );
}

const styles = StyleSheet.create({
  centerDetailContainer: {
    padding: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    height: "100%",
    width: "100%",
  },
  skeletonBox: {
    height: 40,
    width: "100%",
    backgroundColor: "#2a2a2a",
    borderRadius: 4,
    marginBottom: 16,
  },
  skeletonBoxSmall: {
    height: 40,
    width: "80%",
    backgroundColor: "#2a2a2a",
    borderRadius: 4,
    marginBottom: 16,
  },
  skeletonButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 16,
  },
  skeletonButton: {
    height: 40,
    width: "30%",
    backgroundColor: "#2a2a2a",
    borderRadius: 4,
  },
});

export default SkeletonCenterDetails;
