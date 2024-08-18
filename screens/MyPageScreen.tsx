import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import colors from "../styles/colors";
import { DayProps } from "react-native-calendars/src/calendar/day";
import { ScrollView } from "react-native-gesture-handler";
import { supabase } from "../utils/supabase"; // supabase import 추가
import { STORAGE_PATHS, TABLES, USER_FIELDS } from "../constants/supabase";

const MyPageScreen = () => {
  const [profile, setProfile] = useState({
    name: "",
    message: "안녕하세요! 오늘도 화이팅!",
    profileImage: "",
    badgeCount: 0,
    hangonCount: 0,
  });

  const [currentDate, setCurrentDate] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [displayedMonth, setDisplayedMonth] = useState(new Date());

  const completedDates = ["2024-03-10", "2024-03-24"];

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setCurrentDate(formattedDate);
    setTodayDate(formattedDate);

    const fetchProfile = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError.message);
        return;
      }

      const user = userData?.user;
      if (!user) {
        console.error("No user found");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from(TABLES.USER)
        .select("*")
        .eq(USER_FIELDS.ID, user.id);

      console.log(profileData);

      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
      } else if (profileData && profileData.length > 0) {
        const profile = profileData[0]; // 첫 번째 결과만 사용
        console.log(profile);

        const { data: avatarData, error: avatarError } = await supabase.storage
          .from(STORAGE_PATHS.AVATARS)
          .createSignedUrl(profile.avatar_url, 60);

        if (avatarError) {
          console.error("Error fetching avatar URL:", avatarError.message);
        }

        setProfile({
          name: `${profile.nickname}님`,
          message: profile.message,
          profileImage: avatarData?.signedUrl || "",
          badgeCount: profile.badge_count || 0,
          hangonCount: profile.hangon_count || 0,
        });
      }
    };

    fetchProfile();
  }, []);

  const renderCustomDay = (day: string & DateData) => {
    const isSelected = day.dateString === currentDate;
    const isCompleted = completedDates.includes(day.dateString);
    const isToday = day.dateString === todayDate;

    return (
      <View
        style={[
          styles.dayContainer,
          isSelected && styles.selectedDay,
          isCompleted && styles.completedDay,
        ]}
      >
        <Text style={[styles.dayText, isCompleted && styles.completedDayText]}>
          {day.day}
        </Text>
      </View>
    );
  };

  const handlePrevMonth = () => {
    const newDate = new Date(displayedMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setDisplayedMonth(newDate);

    console.log("Move to previous month", newDate.getMonth() - 1);
  };

  const handleNextMonth = () => {
    const newDate = new Date(displayedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setDisplayedMonth(newDate);

    console.log("Move to next month", newDate.getMonth() + 1);
  };

  const handleToday = () => {
    const today = new Date();
    setDisplayedMonth(today);
    setCurrentDate(today.toISOString().split("T")[0]);
  };

  const handleMove = () => {
    console.log("Move to monthly climbing stats");
  };

  const WEEKS = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: profile.profileImage }}
          style={styles.profileImage}
        />
        <View style={styles.profileTextSection}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.message}>{profile.message}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.profileButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={styles.profileButtonText}>프로필 변경</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.divider}></View>
      <Pressable
        onPress={handleMove}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      >
        <View style={styles.statsSection}>
          <View style={styles.statsSectionHeader}>
            <Text style={styles.statsSectionHeaderText}>
              나의 월간 클라이밍
            </Text>
            <Text style={styles.arrowText}>{">"}</Text>
          </View>
          <Text style={styles.statsSectionSubHeader}>
            저번달보다 운동량이 6번 늘었어요
          </Text>
          <View style={styles.statItemContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>센터 방문</Text>
              <Text style={styles.statValue}>{profile.badgeCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>완등</Text>
              <Text style={styles.statValue}>{profile.hangonCount}</Text>
            </View>
          </View>
        </View>
      </Pressable>
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <View style={styles.monthTextContainer}>
            <Text style={styles.monthText}>
              {displayedMonth.getFullYear()}년 {displayedMonth.getMonth() + 1}월
            </Text>
            <Pressable
              onPress={handleToday}
              style={({ pressed }) => [
                styles.todayButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.todayButtonText}>오늘</Text>
            </Pressable>
          </View>
          <View style={styles.moveButtonContainer}>
            <Pressable
              onPress={handlePrevMonth}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Image
                source={require("../assets/images/my-page/white-left-arrow.png")}
              />
            </Pressable>
            <Pressable
              onPress={handleNextMonth}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Image
                source={require("../assets/images/my-page/gray-right-arrow.png")}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.dayHeader}>
          {WEEKS.map((day) => (
            <View key={day}>
              <Text style={styles.dayName}>{day}</Text>
            </View>
          ))}
        </View>
        <Calendar
          key={displayedMonth.toISOString().split("T")[0]}
          current={displayedMonth.toISOString().split("T")[0]} // currentDate 대신 displayedMonth 사용
          markedDates={{
            [currentDate]: {
              selected: true,
              selectedColor: colors.gray500,
            },
            "2024-03-10": {
              customStyles: {
                container: {
                  backgroundColor: "#CDE569",
                },
                text: {
                  color: "#000000",
                  fontWeight: "bold",
                },
              },
            },
            "2024-03-24": {
              customStyles: {
                container: {
                  backgroundColor: "#CDE569",
                },
                text: {
                  color: "#000000",
                  fontWeight: "bold",
                },
              },
            },
          }}
          theme={{
            calendarBackground: colors.black600,
            textSectionTitleColor: "#F7F7F7",
            todayTextColor: "#F7F7F7",
            dayTextColor: "#F7F7F7",
            selectedDayBackgroundColor: colors.black600,
            monthTextColor: "#F7F7F7",
            indicatorColor: colors.gray500,
            arrowColor: "transparent",
          }}
          customHeader={() => <View></View>}
          dayComponent={({
            date,
          }: DayProps & { date?: DateData | undefined }) =>
            renderCustomDay(date as string & DateData)
          }
          style={styles.calendar}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 16,
    paddingBottom: 60,
  },
  header: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#dddddd",
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
    paddingHorizontal: 16, // 좌우 padding 추가
    height: 40, // 버튼 높이 고정
    justifyContent: "center",
    alignItems: "center",
  },
  profileButtonText: {
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 24, // 텍스트의 높이에 맞춘 lineHeight 설정
  },

  divider: {
    borderBottomColor: "#333333",
    borderBottomWidth: 2,
    marginVertical: 20,
  },

  statsSection: {
    backgroundColor: colors.black600,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 20,
    borderRadius: 24,
  },
  statsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  statsSectionHeaderText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  arrowText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  statsSectionSubHeader: {
    color: "#AAAAAA",
    fontSize: 12,
    marginBottom: 24,
  },
  statItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.gray200,
    padding: 10,
    borderRadius: 16,
    flex: 1,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: "normal",
    color: colors.white500,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white500,
  },

  calendar: {},
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  selectedDay: {
    backgroundColor: colors.gray500,
  },
  completedDay: {
    backgroundColor: "#CDE569",
    borderRadius: 8,
  },
  completedDayText: {
    color: "#000000",
    fontWeight: "bold",
  },
  dayText: {
    color: "#F7F7F7",
  },

  monthTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  monthText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  moveMonthButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  todayButton: {
    backgroundColor: "#CDE569",
    borderRadius: 999,
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  todayButtonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  arrow: {
    width: 28,
    height: 28,
  },
  calendarContainer: {
    backgroundColor: colors.black600,
    borderRadius: 24,
    padding: 16,
    marginBottom: 60,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginHorizontal: 16,
  },
  month: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: 21,
  },
  dayName: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  moveButtonContainer: {
    flexDirection: "row",
    gap: 12,
  },
});

export default MyPageScreen;
