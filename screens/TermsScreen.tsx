import { useCallback, useMemo, useRef, useState } from "react";
import {
  Button,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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

  const openBottomSheet = (content: string) => {
    setModalContent(content);
    handleOpenPress();
  };

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleOpenPress = () => bottomSheetRef.current?.expand();
  const handleCollapsePress = () => bottomSheetRef.current?.collapse();
  const snapeToIndex = (index: number) =>
    bottomSheetRef.current?.snapToIndex(index);
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

  console.log("snapPoints", snapPoints);

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
            onPress={() =>
              openBottomSheet(`**제1조 (목적)**

이 약관은 HANG-ON (이하 "행온")이 제공하는 모든 온라인 서비스 및 모바일 어플리케이션 (이하 "서비스")을 이용함에 있어 회사와 이용자(이하 "이용자")간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

**제2조 (용어의 정의)**

1. "서비스"라 함은 회사가 제공하는 모든 온라인 서비스 및 모바일 어플리케이션을 의미합니다.
2. "이용자"라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
3. "회원"이라 함은 회사에 개인정보를 제공하여 회원등록을 하고 회사가 제공하는 서비스를 지속적으로 이용할 수 있는 자를 의미합니다.
4. "비회원"이라 함은 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 의미합니다.

**제3조 (약관의 효력 및 변경)**

1. 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.
2. 회사는 합리적인 사유가 발생할 경우 관련 법령에 따라 약관을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 공지함으로써 효력을 발생합니다.
3. 이용자는 변경된 약관에 동의하지 않을 권리가 있으며, 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 회원 탈퇴를 요청할 수 있습니다.

**제4조 (회원가입 및 탈퇴)**

1. 이용자는 회사가 정한 절차에 따라 회원가입을 신청할 수 있으며, 회사는 이에 대한 승낙을 통해 회원으로 등록됩니다.
2. 회원은 언제든지 회사에 탈퇴를 요청할 수 있으며, 회사는 즉시 회원 탈퇴를 처리합니다.
3. 회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수 있습니다:
    - 가입 신청 시 허위 내용을 기재한 경우
    - 다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우
    - 법령 및 이 약관이 금지하거나 미풍양속에 반하는 행위를 하는 경우

**제5조 (서비스의 제공 및 변경)**

1. 회사는 다음과 같은 서비스를 제공합니다:
    - 위치 기반 서비스
    - 지도 및 경로 탐색 서비스
    - 기타 회사가 정하는 서비스
2. 회사는 서비스의 내용 및 기술적 사양을 변경할 수 있으며, 이 경우 변경 내용을 사전에 공지합니다.

**제6조 (서비스 이용의 제한)**

1. 회사는 다음 각 호에 해당하는 경우 서비스 이용을 제한할 수 있습니다:
    - 법령이나 공공질서, 미풍양속을 위반하는 경우
    - 타인의 명예를 손상시키거나 불이익을 주는 행위를 하는 경우
    - 회사의 합리적인 판단에 따라 서비스 제공에 지장이 있다고 판단되는 경우

**제7조 (개인정보 보호)**

1. 회사는 이용자의 개인정보를 보호하기 위해 개인정보 보호법 등 관련 법령을 준수합니다.
2. 회사는 이용자의 개인정보를 이용 목적 외의 용도로 사용하거나 제3자에게 제공하지 않습니다.
3. 개인정보의 수집, 이용, 제공, 보호 등에 관한 자세한 사항은 회사의 개인정보처리방침에 따릅니다.

**제8조 (이용자의 의무)**

1. 이용자는 다음 행위를 하여서는 안됩니다:
    - 신청 또는 변경 시 허위 내용의 등록
    - 타인의 정보 도용
    - 회사가 게시한 정보의 변경
    - 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시
    - 회사와 기타 제3자의 저작권 등 지식재산권에 대한 침해
    - 회사와 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위

**제9조 (면책조항)**

1. 회사는 천재지변, 전쟁, 불가항력 등으로 인해 서비스를 제공할 수 없는 경우, 이로 인한 책임을 지지 않습니다.
2. 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
3. 회사는 이용자가 게재한 정보, 자료 등의 정확성, 신뢰성에 대해 책임을 지지 않습니다.

**제10조 (분쟁 해결)**

1. 회사와 이용자 간에 발생한 전자상거래 분쟁과 관련하여 이용자의 피해구제 신청이 있는 경우, 공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.
2. 이 약관과 관련된 분쟁에 관한 소송은 회사의 본사 소재지를 관할하는 법원을 전속 관할법원으로 합니다.

**부칙**

1. 이 약관은 [시행일자]부터 시행됩니다.`)
            }
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
            onPress={() =>
              openBottomSheet(`HANG-ON(이하 "회사" 또는 "행온")은 이용자의 개인정보를 중요시하며, 「개인정보 보호법」을 준수하고 있습니다. 본 개인정보 처리방침은 이용자가 제공한 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보 보호를 위해 어떠한 조치가 취해지고 있는지를 알려드립니다.

**제1조 (개인정보의 수집 항목 및 수집 방법)**

1. 수집 항목
    - 필수항목: 이름, 이메일 주소, 전화번호, 로그인ID, 비밀번호, 위치 정보
    - 선택항목: 프로필 사진, 생년월일, 성별, 기타 개인 설정 정보
2. 수집 방법
    - 홈페이지, 모바일 어플리케이션, 서면 양식
    - 회원가입, 상담, 서비스 이용 과정에서 이용자가 자발적으로 제공
    - 제휴사로부터의 제공
    - 생성정보 수집 툴을 통한 수집

**제2조 (개인정보의 수집 및 이용 목적)**

1. 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금 정산
    - 콘텐츠 제공, 특정 맞춤 서비스 제공, 본인 인증, 구매 및 요금 결제, 물품 배송 및 청구서 등 발송
2. 회원 관리
    - 회원제 서비스 제공, 개인식별, HANG-ON 이용 약관 위반 회원에 대한 이용 제한 조치, 가입 의사 확인, 가입 및 가입횟수 제한, 분쟁 조정을 위한 기록 보존, 불만 처리 등 민원 처리, 고지사항 전달
3. 마케팅 및 광고에 활용
    - 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공, 인구통계학적 특성에 따른 서비스 제공 및 광고 게재, 접속 빈도 파악 또는 회원의 서비스 이용에 대한 통계

**제3조 (개인정보의 보유 및 이용 기간)**

회사는 법령에 따른 개인정보 보유, 이용 기간 또는 이용자로부터 개인정보를 수집 시에 동의받은 개인정보 보유, 이용 기간 내에서 개인정보를 처리, 보유합니다.

1. 회원가입 정보: 회원 탈퇴 시 즉시 삭제
2. 관련 법령에 따른 보유 기간
    - 계약 또는 청약철회 등에 관한 기록: 5년
    - 전자상거래 등에서의 소비자 보호에 관한 법률에 따라 5년간 보관
    - 대금 결제 및 재화 등의 공급에 관한 기록: 5년
    - 소비자의 불만 또는 분쟁 처리에 관한 기록: 3년

**제4조 (개인정보의 제3자 제공)**

회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.

- 이용자가 사전에 동의한 경우
- 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

**제5조 (개인정보 처리 위탁)**

회사는 원활한 서비스 제공을 위해 개인정보 처리 업무를 외부 전문 업체에 위탁할 수 있습니다. 위탁 시 법령에 따라 개인정보가 안전하게 관리될 수 있도록 조치를 취합니다.

**제6조 (이용자의 권리 및 행사 방법)**

1. 이용자는 언제든지 회사에 대해 개인정보 열람, 정정, 삭제, 처리정지 요구 등의 권리를 행사할 수 있습니다.
2. 권리 행사는 고객센터를 통해 서면, 전자우편, 모사전송(FAX) 등을 통해 하실 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.
3. 이용자가 개인정보의 오류에 대한 정정을 요청한 경우, 정정을 완료하기 전까지 당해 개인정보를 이용하거나 제공하지 않습니다.
4. 권리 행사는 이용자의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 위임장을 제출하셔야 합니다.

**제7조 (개인정보의 파기)**

1. 회사는 개인정보 보유 기간이 경과된 후에는 해당 정보를 지체 없이 파기합니다.
2. 파기의 절차 및 방법은 다음과 같습니다.
    - 파기 절차: 이용자가 입력한 정보는 목적 달성 후 별도의 DB로 옮겨져 일정 기간 저장된 후 혹은 즉시 파기됩니다. 이 때, 별도의 DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 다른 목적으로 이용되지 않습니다.
    - 파기 방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.

**제8조 (개인정보 보호를 위한 기술적·관리적 조치)**

회사는 이용자의 개인정보를 취급함에 있어 개인정보가 분실, 도난, 유출, 변조 또는 훼손되지 않도록 안전성 확보를 위해 다음과 같은 조치를 하고 있습니다.

1. 비밀번호의 암호화
    - 이용자의 비밀번호는 암호화되어 저장 및 관리되고 있으며, 개인정보의 확인 및 변경은 비밀번호를 알고 있는 본인만이 가능합니다.
2. 해킹 등에 대비한 대책
    - 회사는 해킹이나 컴퓨터 바이러스 등에 의해 이용자의 개인정보가 유출되거나 훼손되는 것을 막기 위해 외부로부터의 접근을 통제하고, 침입 탐지 시스템 및 취약점 분석 시스템을 설치하여 24시간 감시하고 있습니다.
3. 개인정보 취급 직원의 최소화 및 교육
    - 개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜 최소화 하며, 개인정보보호 교육을 실시하고 있습니다.

**제9조 (개인정보 보호 책임자 및 담당자)**

회사는 이용자의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 관련 부서 및 개인정보 보호책임자를 지정하고 있습니다.

1. 개인정보 보호책임자: [노은영]
2. 개인정보 보호 담당부서: [지원 1팀]
3. 연락처: [010-2666-1460]

**제10조 (기타)**

이 개인정보 처리방침은 2023년 [시행일자]부터 적용됩니다.`)
            }
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
            onPress={() =>
              openBottomSheet(`**1. 마케팅 정보 수신 동의 목적**

본 동의서는 HANG-ON (이하 "회사" 또는 "행온")가 제공하는 마케팅 정보에 대한 수신 여부를 결정함에 있어 필요한 동의를 받기 위함입니다.

**2. 수집 및 이용 목적**

회사는 이용자의 개인정보를 다음과 같은 목적으로 수집 및 이용합니다:

- 신상품, 이벤트, 프로모션 제공
- 뉴스레터, 광고성 정보 제공
- 맞춤형 서비스 및 상품 추천
- 고객 혜택 정보 제공

**3. 수집 및 이용 항목**

- 필수: 성명, 이메일 주소, 휴대전화 번호
- 선택: 생년월일, 성별, 주소

**4. 수신 동의 방법 및 해지**

1. 수신 동의 방법
    - 이용자는 회원가입 시 또는 별도의 마케팅 정보 수신 동의 페이지를 통해 수신 동의를 할 수 있습니다.
2. 수신 해지 방법
    - 이용자는 언제든지 아래의 방법을 통해 마케팅 정보 수신 동의를 철회할 수 있습니다:
        - 이메일: [연락처 이메일 주소]
        - 전화: [연락처 전화번호]
        - SMS: 수신한 메시지 내의 "수신 거부" 링크 클릭

**5. 개인정보의 보유 및 이용 기간**

- 이용자가 마케팅 정보 수신 동의를 철회할 때까지 보유 및 이용
- 수신 동의 철회 시, 해당 정보는 지체 없이 파기

**6. 동의 거부 권리 및 불이익 사항**

이용자는 마케팅 정보 수신 동의를 거부할 권리가 있으며, 동의 거부 시에도 회원 가입 및 서비스 이용에는 제한이 없습니다. 단, 마케팅 정보 수신에 동의하지 않을 경우, 회사가 제공하는 다양한 혜택 및 정보를 제공받지 못할 수 있습니다.`)
            }
          />
        </View>

        {/* 다음으로 이동 버튼 */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Profile")}
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
          // backgroundStyle={{ backgroundColor: "#1d0f4e" }}
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
    color: colors.white,
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
    color: colors.white,
    flex: 1, // 텍스트가 남은 공간을 차지하도록 설정
  },
  separator: {
    height: 1,
    backgroundColor: colors.white,
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
