import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars"; // 추가적인 패키지가 필요할 수 있습니다.

const MyPageScreen = () => {
  const [profile, setProfile] = useState({
    name: "Abctest님",
    message: "안녕하세요! 오늘도 화이팅!",
    profileImage: "link_to_profile_image", // 프로필 이미지 링크
    badgeCount: 27,
    hangonCount: 56,
  });

  const [currentDate, setCurrentDate] = useState("2024-03-24");

  return (
    <View style={styles.container}>
      <Text style={styles.header}>HANG-ON</Text>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: profile.profileImage }}
          style={styles.profileImage}
        />

        <View style={styles.profileTextSection}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.message}>{profile.message}</Text>

          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileButtonText}>프로필 변경</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider}></View>

      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.badgeCount}</Text>
          <Text style={styles.statLabel}>셋팅 방문</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.hangonCount}</Text>
          <Text style={styles.statLabel}>일촌</Text>
        </View>
      </View>

      <Calendar
        // 일정 컴포넌트의 기본 날짜 설정
        current={currentDate}
        markedDates={{
          [currentDate]: {
            selected: true,
            marked: true,
            selectedColor: "blue",
          },
        }}
        // 달력 설정 및 스타일링에 관한 코드는 추가 필요
        theme={{
          calendarBackground: "#1A1A1A",
          textSectionTitleColor: "#CCCCCC",
          todayTextColor: "#FFFFFF",
          dayTextColor: "#CCCCCC",
          selectedDayBackgroundColor: "#333333",
          monthTextColor: "#FFFFFF",
          indicatorColor: "blue",
        }}
        style={styles.calendar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 16,
  },
  header: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 15,
  },
  profileSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#dddddd", // 임시 색상
  },
  profileTextSection: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  message: {
    fontSize: 12,
    color: "#cfcccc",
    marginBottom: 16,
  },
  profileButton: {
    backgroundColor: "#CDDC39",
    borderRadius: 20,
    paddingVertical: 8,
    display: "flex",
    justifyContent: "center",
  },
  profileButtonText: {
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -3,
  },
  divider: {
    borderBottomColor: "#333333",
    borderBottomWidth: 2,
    marginVertical: 20,
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
    backgroundColor: "#333333",
    padding: 10,
    borderRadius: 10,
  },
  statValue: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 16,
    color: "#AAAAAA",
  },
  calendar: {
    borderWidth: 1,
    borderColor: "gray",
    height: 350,
  },
});

export default MyPageScreen;
