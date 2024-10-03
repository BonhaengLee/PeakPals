import BottomSheet, {
  BottomSheetBackgroundProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, {
  useMemo,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { View, Text, StyleSheet, Button, Pressable } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import LinearGradient from "react-native-linear-gradient";

import { MapContext } from "../../context/MapContext";
import { SegmentedControl } from "./SegmentedControl";
import { colors } from "../../styles/colors";
import { MIN_SHEET_HEIGHT } from "../../screens/HomeScreen";
import CenterDetails from "../center-details/CenterDetails";
import SkeletonCenterDetails from "../center-details/SkeletonCenterDetails";

interface BottomSheetComponentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  renderCenters: () => React.ReactNode;
  sheetIndex: number;
  handleSheetChanges: (index: number) => void;
}
/* 
  바텀시트가 전체 높이까지 열릴 수 있으면서도, 
  바텀시트가 닫혀있거나 부분적으로 열려있을 때 지도와의 인터랙션 가능
  바텀시트는 핸들 영역이나 내부 컨텐츠를 통해서만 드래그 가능
*/
export default function BottomSheetComponent({
  activeTab,
  setActiveTab,
  renderCenters,
  sheetIndex,
  handleSheetChanges,
}: BottomSheetComponentProps) {
  const { selectedCenter, setSelectedCenter } = useContext(MapContext);
  const snapPoints = useMemo(
    () =>
      selectedCenter
        ? [MIN_SHEET_HEIGHT, "100%"]
        : [MIN_SHEET_HEIGHT, "50%", "90%"],
    [selectedCenter]
  );
  const bottomSheetRef = useRef<BottomSheet>(null);

  const renderHandle = useCallback(
    () => (
      <View style={styles.bottomSheetHandle}>
        <View style={styles.handleBar} />
      </View>
    ),
    []
  );

  const handleBackButtonPress = () => {
    if (bottomSheetRef.current) {
      // 가장 작은 높이로 최소화되게 하기
      bottomSheetRef.current.snapToIndex(0);
    }
  };

  // 센터 상세페이지용 handle(header)
  const renderCenterDetailHandle = useCallback(
    () => (
      <View style={styles.bottomSheetHeader}>
        {/* Back Button */}
        <Pressable onPress={handleBackButtonPress} style={styles.backButton}>
          <FontAwesome5 name="chevron-left" size={24} color="white" />
        </Pressable>

        {/* Draggable Handle */}
        {/* <View style={styles.handleBar} /> */}
      </View>
    ),
    []
  );

  const renderContent = useCallback(
    () => (
      <BottomSheetScrollView
        contentContainerStyle={styles.bottomSheetScrollViewContent}
      >
        <SegmentedControl activeTab={activeTab} setActiveTab={setActiveTab} />

        {renderCenters()}
      </BottomSheetScrollView>
    ),
    [activeTab]
  );

  const [loading, setLoading] = useState(false); // New loading state

  const renderDynamicContent = () => {
    if (loading) {
      // Render the skeleton screen while loading
      return <SkeletonCenterDetails />;
    }
    if (isCenterDetail) {
      return <CenterDetails selectedCenter={selectedCenter} />;
    }
    return null;
  };

  const CustomBackground = ({ style }: BottomSheetBackgroundProps) => (
    <View
      style={[
        style,
        {
          backgroundColor: colors.ui04,
        },
      ]}
    />
  );

  // 센터 상세 페이지 표시를 위한 상탯값
  const [isCenterDetail, setIsCenterDetail] = useState(false);
  const handleSheetChangesWithData = (index: number) => {
    handleSheetChanges(index);

    // Set isCenterDetail based on whether the sheet is fully open or not
    if (index === snapPoints.length - 1) {
      setLoading(true); // Start loading when expanding

      // Simulate loading delay before showing details
      setTimeout(() => {
        setLoading(false); // Stop loading and show detailed info
        setIsCenterDetail(true);
      }, 150); // 500ms delay for skeleton
    } else {
      // Sheet is not fully expanded, show simplified info
      setIsCenterDetail(false);
    }
  };

  console.log({ isCenterDetail });

  return selectedCenter ? (
    <BottomSheet
      ref={bottomSheetRef}
      index={sheetIndex}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backdropComponent={null}
      /* 
        바텀시트가 전체 높이까지 열릴 수 있으면서도, 
        바텀시트가 닫혀있거나 부분적으로 열려있을 때 지도와의 인터랙션 가능
        바텀시트는 핸들 영역이나 내부 컨텐츠를 통해서만 드래그 가능
      */
      handleComponent={isCenterDetail ? renderCenterDetailHandle : renderHandle}
      enableOverDrag={false}
      enableContentPanningGesture={true}
      onChange={handleSheetChanges}
      backgroundComponent={CustomBackground}
      onChange={handleSheetChangesWithData}
    >
      <LinearGradient
        colors={
          // 이거 isCenterDetail이 false일 땐 동작하면 안됨
          isCenterDetail
            ? ["#16171D", "rgba(22, 23, 29, 0.10)"]
            : [colors.ui03, colors.ui03]
        }
        style={
          isCenterDetail
            ? styles.centerDetailContainer
            : styles.minimizedCenterDetailContainer
        }
      >
        {/* Center Name and Address should always be visible */}
        <View
          style={
            isCenterDetail
              ? styles.centerInfoContainer
              : styles.minimizedCenterInfoContainer
          }
        >
          <Text style={styles.centerName}>{selectedCenter.name}</Text>
          <Text style={styles.centerAddress}>{selectedCenter.address}</Text>
        </View>

        {renderDynamicContent()}
      </LinearGradient>
    </BottomSheet>
  ) : (
    <BottomSheet
      ref={bottomSheetRef}
      index={sheetIndex}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backdropComponent={null}
      handleComponent={renderHandle}
      enableOverDrag={false}
      enableContentPanningGesture={true}
      onChange={handleSheetChanges}
      backgroundComponent={CustomBackground}
    >
      {renderContent()}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  centerInfoContainer: {
    padding: 16,
    backgroundColor: "transparent",
  },
  minimizedCenterInfoContainer: {
    padding: 16,
    backgroundColor: colors.ui03,
  },
  bottomSheetHandle: {
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: colors.ui04,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.bottomSheetHandleBlack,
  },
  bottomSheetScrollViewContent: {
    padding: 20,
    backgroundColor: colors.ui04,
    flexGrow: 1,
  },
  centerName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  centerAddress: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 4,
  },
  noSelectionText: {
    color: "#ccc",
    textAlign: "center",
  },
  centerDetailContainer: {
    backgroundColor: "transparent",
  },
  minimizedCenterDetailContainer: {
    marginTop: 16,
    backgroundColor: colors.ui03,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
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
  difficultyRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1a1a1a",
  },
  backButton: {
    // padding: 4,
  },
});
