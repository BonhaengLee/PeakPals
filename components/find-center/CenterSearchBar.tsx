import React from "react";
import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CenterSearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearchSubmit?: () => void;
  onClick?: () => void;
  disableInput?: boolean;
}

const CenterSearchBar: React.FC<CenterSearchBarProps> = ({
  searchTerm,
  onSearchTermChange,
  onSearchSubmit,
  onClick,
  disableInput = false,
}) => {
  return (
    <Pressable onPress={onClick} style={styles.searchBarContainer}>
      <TextInput
        style={styles.input}
        value={searchTerm}
        onChangeText={onSearchTermChange}
        placeholder="센터명 및 위치 검색"
        placeholderTextColor="#B6B6B6"
        editable={!disableInput}
        onSubmitEditing={onSearchSubmit}
        pointerEvents={onClick ? "none" : "auto"} // 클릭시 검색 금지
      />
      <Ionicons
        name="search"
        size={24}
        color="#B6B6B6"
        onPress={onSearchSubmit}
        style={styles.icon}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  icon: {
    marginLeft: 10,
  },
});

export default CenterSearchBar;
