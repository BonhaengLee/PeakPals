import BottomSheet, {
  BottomSheetBackgroundProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useMemo, useCallback, useContext, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";

import { MapContext } from "../../context/MapContext";
import { SegmentedControl } from "./SegmentedControl";
import { colors } from "../../styles/colors";
import { MIN_SHEET_HEIGHT } from "../../screens/HomeScreen";

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
  const { selectedCenter } = useContext(MapContext);
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

  const renderCenterInfo = () => {
    if (selectedCenter) {
      return (
        <View style={styles.centerInfoContainer}>
          <Text style={styles.centerName}>{selectedCenter.name}</Text>
          <Text style={styles.centerAddress}>{selectedCenter.address}</Text>
        </View>
      );
    }
    return <Text style={styles.noSelectionText}>센터를 선택해 주세요</Text>;
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

  return selectedCenter ? (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backdropComponent={null}
      /* 
        바텀시트가 전체 높이까지 열릴 수 있으면서도, 
        바텀시트가 닫혀있거나 부분적으로 열려있을 때 지도와의 인터랙션 가능
        바텀시트는 핸들 영역이나 내부 컨텐츠를 통해서만 드래그 가능
      */
      handleComponent={renderHandle}
      enableOverDrag={false}
      enableContentPanningGesture={true}
      onChange={handleSheetChanges}
      backgroundComponent={CustomBackground}
      // 바텀시트는 SearchBar보다는 z-index가 커야 함
    >
      {renderCenterInfo()}
    </BottomSheet>
  ) : (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
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
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
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
    borderRadius: 2,
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
});
