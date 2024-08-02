import { useCallback, useMemo, useRef, useState } from "react";
import {
  Button,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import CheckBox from "expo-checkbox";
import { RootStackScreenProps } from "../navigation/types";
import { Feather } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

import colors from "../styles/colors";
import { supabase } from "../utils/supabase";
import { TABLES } from "../constants/supabase";
import { TERMS_AGREEMENT_LIST } from "../constants/termsAgreement";

interface TermsScreenProps {
  navigation: RootStackScreenProps<"Terms">["navigation"];
}

export default function TermsScreen({ navigation }: TermsScreenProps) {
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const [modalContent, setModalContent] = useState("");
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleAgreeAll = (newValue: boolean) => {
    setAgreeAll(newValue);
    setAgreeService(newValue);
    setAgreePrivacy(newValue);
    setAgreeMarketing(newValue);
  };

  const handleSubmit = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError.message);
      return;
    }

    if (!user) {
      console.error("No authenticated user");
      return;
    }

    console.log("Authenticated user:", user);

    try {
      console.log("Attempting to insert user with ID:", user.id);
      const { data: userData, error: userInsertError } = await supabase
        .from(TABLES.USER)
        .upsert({
          id: user.id,
          email: user.email,
          nickname: user.email?.split("@")[0], // 기본 닉네임 설정
        });

      if (userInsertError) {
        console.error("Error inserting user:", userInsertError.message);
        Alert.alert("Error", userInsertError.message);
        return;
      }

      console.log("User inserted successfully:", userData);

      console.log(
        "Attempting to insert terms agreement for user with ID:",
        user.id
      );
      const { data, error } = await supabase
        .from(TABLES.TERMS_AGREEMENT)
        .upsert([
          {
            id: user.id, // 새롭게 추가된 UUID 값
            user_id: user.id,
            service: agreeService,
            privacy: agreePrivacy,
            marketing: agreeMarketing,
          },
        ]);

      if (error) {
        console.error("Error upserting terms agreement:", error.message);
        Alert.alert("Error", error.message);
      } else {
        console.log("Terms agreement upserted successfully:", data);
        navigation.navigate("Profile");
      }
    } catch (error) {
      console.error(
        "Unexpected error:",
        (
          error as {
            message: string;
          }
        ).message
      );
    }
  };

  const openBottomSheet = (content: string) => {
    setModalContent(content);
    handleOpenPress();
  };

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleOpenPress = () => bottomSheetRef.current?.expand();
  // const handleCollapsePress = () => bottomSheetRef.current?.collapse();
  // const snapeToIndex = (index: number) =>
  //   bottomSheetRef.current?.snapToIndex(index);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  // console.log("snapPoints", snapPoints);

  const renderContent = () => (
    <View style={styles.bottomSheetContent}>
      <Text style={styles.modalText}>{modalContent}</Text>
      <Button title="닫기" onPress={handleClosePress} />
    </View>
  );

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        {/* 행온 서비스 이용 동의 페이지 */}
        <Text style={styles.title}>서비스 이용 동의</Text>

        {/* 약관 전체 동의 */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.touchableCheckbox}
            onPress={() => handleAgreeAll(!agreeAll)}
          >
            <View style={styles.checkboxWrapper}>
              <CheckBox
                value={agreeAll}
                onValueChange={handleAgreeAll}
                style={styles.checkbox}
                color={agreeAll ? colors.primary : undefined}
              />
            </View>
            <Text style={styles.label}>약관 전체 동의</Text>
          </TouchableOpacity>

          <Feather
            style={styles.feather}
            name="chevron-right"
            size={24}
            color="white"
            onPress={() => openBottomSheet("약관 전체 동의 내용")}
          />
        </View>

        <View style={styles.separator} />

        {/* (필수) 서비스 이용약관 */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.touchableCheckbox}
            onPress={() => setAgreeService(!agreeService)}
          >
            <View style={styles.checkboxWrapper}>
              <CheckBox
                value={agreeService}
                onValueChange={(newValue) => setAgreeService(newValue)}
                style={styles.checkbox}
                color={agreeService ? colors.primary : undefined}
              />
            </View>
            <Text style={styles.label}>(필수) 서비스 이용약관</Text>
          </TouchableOpacity>

          <Feather
            style={styles.feather}
            name="chevron-right"
            size={24}
            color="white"
            onPress={() => openBottomSheet(TERMS_AGREEMENT_LIST.SERVICE)}
          />
        </View>

        {/* (필수) 개인정보 처리 방침 */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.touchableCheckbox}
            onPress={() => setAgreePrivacy(!agreePrivacy)}
          >
            <View style={styles.checkboxWrapper}>
              <CheckBox
                value={agreePrivacy}
                onValueChange={(newValue) => setAgreePrivacy(newValue)}
                style={styles.checkbox}
                color={agreePrivacy ? colors.primary : undefined}
              />
            </View>
            <Text style={styles.label}>(필수) 개인정보 처리 방침</Text>
          </TouchableOpacity>

          <Feather
            style={styles.feather}
            name="chevron-right"
            size={24}
            color="white"
            onPress={() => openBottomSheet(TERMS_AGREEMENT_LIST.PRIVACY)}
          />
        </View>

        {/* (선택) 마케팅 정보 수신 동의 */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.touchableCheckbox}
            onPress={() => setAgreeMarketing(!agreeMarketing)}
          >
            <View style={styles.checkboxWrapper}>
              <CheckBox
                value={agreeMarketing}
                onValueChange={(newValue) => setAgreeMarketing(newValue)}
                style={styles.checkbox}
                color={agreeMarketing ? colors.primary : undefined}
              />
            </View>
            <Text style={styles.label}>(선택) 마케팅 정보 수신 동의</Text>
          </TouchableOpacity>

          <Feather
            style={styles.feather}
            name="chevron-right"
            size={24}
            color="white"
            onPress={() => openBottomSheet(TERMS_AGREEMENT_LIST.MARKETING)}
          />
        </View>

        {/* 다음으로 이동 버튼 */}
        <TouchableOpacity
          style={styles.button}
          // onPress={() => navigation.navigate("Profile")}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>

        <BottomSheet
          ref={bottomSheetRef}
          // renderContent={renderContent}
          // 초기 페이지 로드 시 열려있지 않도록 설정
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          handleIndicatorStyle={{ backgroundColor: "#fff" }}
          backdropComponent={renderBackdrop}
        >
          {renderContent()}
        </BottomSheet>

        <StatusBar style="auto" />
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: colors.backgroundBlack,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white1000,
    marginBottom: 40,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  touchableCheckbox: {
    flexDirection: "row",
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: -6,
  },
  checkbox: {
    marginRight: 10,
  },
  feather: {
    marginLeft: "auto",
  },
  label: {
    fontSize: 16,
    color: colors.white1000,
    flex: 1, // 텍스트가 남은 공간을 차지하도록 설정
  },
  separator: {
    height: 1,
    backgroundColor: colors.white1000,
    marginVertical: 20,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
  },
  buttonText: {
    color: colors.textBlack,
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  bottomSheetContent: {
    backgroundColor: "white",
    padding: 20,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
});
