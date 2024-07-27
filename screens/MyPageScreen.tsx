import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import colors from "../styles/colors";
import { DayProps } from "react-native-calendars/src/calendar/day";
import { ScrollView } from "react-native-gesture-handler";

const MyPageScreen = () => {
  const [profile, setProfile] = useState({
    name: "Abctest님",
    message: "안녕하세요! 오늘도 화이팅!",
    profileImage: "link_to_profile_image",
    badgeCount: 27,
    hangonCount: 56,
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
    const newDate = new Date(
      displayedMonth.setMonth(displayedMonth.getMonth() - 1)
    );
    setDisplayedMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(
      displayedMonth.setMonth(displayedMonth.getMonth() + 1)
    );
    setDisplayedMonth(newDate);
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

  const [date, setDate] = useState(new Date());

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.header}>Peak-Pals</Text> */}
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
      <TouchableOpacity onPress={handleMove}>
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
      </TouchableOpacity>

      <View style={styles.calendarContainer}>
        {/* 캘린더 버튼 위치가 고정이라서 상단에 Custom Header 새로 만듦 */}
        <View style={styles.calendarHeader}>
          <View style={styles.monthTextContainer}>
            <Text style={styles.monthText}>
              {displayedMonth.getFullYear()}년 {displayedMonth.getMonth() + 1}월
            </Text>

            <TouchableOpacity onPress={handleToday} style={styles.todayButton}>
              <Text style={styles.todayButtonText}>오늘</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.moveButtonContainer}>
            <TouchableOpacity
              onPress={() =>
                setDate(new Date(date.setMonth(date.getMonth() - 1)))
              }
            >
              <Image
                source={require("../assets/images/my-page/white-left-arrow.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDate(new Date(date.setMonth(date.getMonth() + 1)));
              }}
            >
              <Image
                source={require("../assets/images/my-page/gray-right-arrow.png")}
              />
            </TouchableOpacity>
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
          current={currentDate}
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
    paddingVertical: 8,
    justifyContent: "center",
  },
  profileButtonText: {
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
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
    // alignItems: "center"가 들어가면 텍스트가 아래로 눌림
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
  },
  todayButtonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 14,
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
