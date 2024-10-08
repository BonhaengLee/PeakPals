import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { ClimbingCenter } from "../../types";

// Map color names to actual colors for the difficulty boxes
const colorMap: { [key: string]: string } = {
  흰색: "#FFFFFF",
  노랑: "#FFFF00",
  초록: "#008000",
  파랑: "#0000FF",
  빨강: "#FF0000",
  검정: "#000000",
  회색: "#808080",
  갈색: "#8B4513",
  핑크: "#FFC0CB",
};

function CenterDetails({ selectedCenter }: { selectedCenter: ClimbingCenter }) {
  // Parse difficulty levels from the center's data
  const difficultyLevels = selectedCenter.difficulty_levels
    ? selectedCenter.difficulty_levels.split(" - ")
    : [];

  // Prepare facility tags dynamically based on available facilities
  const facilities = [
    { label: "#주차가능", condition: selectedCenter.parking },
    // FIXME: shower 추가
    { label: "#샤워실", condition: selectedCenter.shower },
    { label: "#세족실", condition: selectedCenter.foot_wash_area },
    { label: "#지구력 벽", condition: selectedCenter.endurance_wall },
    { label: "#킬터보드", condition: selectedCenter.kilter_board },
    { label: "#문보드", condition: selectedCenter.moon_board },
  ];

  // Render only the facilities that are available
  const renderedFacilities = facilities
    .filter((facility) => facility.condition)
    .map((facility, index) => (
      <Text key={index} style={styles.facilityTag}>
        {facility.label}
      </Text>
    ));

  return (
    <View style={styles.centerDetailContainer}>
      {/* Buttons for saved, phone, and share */}
      <View style={styles.buttonRow}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>저장됨</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>전화</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>공유</Text>
        </Pressable>
      </View>

      {/* Comments Section */}
      <View style={styles.commentSection}>
        <Text style={styles.comment}>개생초보: 헐 지금 가려했는데</Text>
        <Text style={styles.comment}>나라라: 지금 가는 중인데 ㅠㅠ</Text>
        <Text style={styles.comment}>앙잉웅: ㅋㅋㅋㅋㅋㅋㅋㅋㅋ</Text>
      </View>

      {/* Facilities Section */}
      <Text style={styles.centerInfoTitle}>시설</Text>
      <View style={styles.facilitiesRow}>
        {renderedFacilities.length > 0 ? (
          renderedFacilities
        ) : (
          <Text style={styles.noFacilitiesText}>시설 정보 없음</Text>
        )}
      </View>

      {/* Difficulty Section */}
      <Text style={styles.centerInfoTitle}>난이도</Text>
      <View style={styles.difficultyRow}>
        {difficultyLevels.map((level, index) => (
          <View
            key={index}
            style={[
              styles.difficultyBox,
              { backgroundColor: colorMap[level] || "#CCC" },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerDetailContainer: {
    padding: 16,
    backgroundColor: "transparent", //"#1a1a1a",
    height: "100%",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#222",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#D3D3D3",
    fontSize: 14,
  },
  commentSection: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  comment: {
    color: "#D3D3D3",
    fontSize: 12,
    marginBottom: 4,
  },
  centerInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    color: "white",
  },
  facilitiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  facilityTag: {
    backgroundColor: "#222",
    color: "#D3D3D3",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    margin: 4,
    fontSize: 12,
  },
  noFacilitiesText: {
    color: "#D3D3D3",
    fontSize: 12,
  },
  difficultyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  difficultyBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
  },
});

export default CenterDetails;
