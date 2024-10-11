import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";

import { climbingCenters } from "../data/climbing-centers";
import { colors } from "../styles/colors";
import { ClimbingCenter } from "../types";
import { MapContext } from "../context/MapContext";
import { supabase } from "../utils/supabase";

export default function CenterSearchScreen({ navigation }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCenters, setFilteredCenters] = useState([]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = climbingCenters.filter((center) =>
        center.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCenters(filtered);
    } else {
      setFilteredCenters([]);
    }
  }, [searchTerm]);

  const [sbCenters, setSBCenters] = useState<ClimbingCenter[]>([]);
  useEffect(() => {
    const fetchCenters = async () => {
      const { data, error } = await supabase.from("ClimbingCenter").select("*");

      if (error) {
        console.error("Error fetching centers:", error);
      } else {
        setSBCenters(data || []);
      }
    };

    fetchCenters();
  }, []);

  const { updateLocation, setSelectedCenter } = useContext(MapContext);

  const handleCenterSelect = (centerId: number) => {
    const selectedCenter = sbCenters.find((center) => center.id === centerId);
    if (selectedCenter) {
      updateLocation(selectedCenter.latitude, selectedCenter.longitude);
      setSelectedCenter(selectedCenter); // 선택된 센터 저장
      console.log("selectedCenter", selectedCenter);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <AntDesign name="close" size={20} color="black" />
        </TouchableOpacity>

        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            placeholder="센터명 및 위치 검색"
            placeholderTextColor="#B6B6B6"
            onChangeText={setSearchTerm}
            autoFocus={true}
          />
          <Ionicons
            name="search"
            size={24}
            color="white"
            style={styles.searchIcon}
          />
        </View>
      </View>

      <View style={styles.registerRequest}>
        <Text style={styles.registerText}>찾는 장소가 없으신가요?</Text>
        <TouchableOpacity onPress={() => console.log("등록 요청")}>
          <Text style={styles.registerButton}>등록 요청</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCenters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCenterSelect(item.id)}>
            <View style={styles.centerItem}>
              <Text style={styles.centerName}>{item.name}</Text>
              <Text style={styles.centerAddress}>{item.address}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.noResults}>검색 결과가 없습니다</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundBlack,
    padding: 16,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  closeButton: {
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 50,
    marginRight: 8,
    height: 48,
    width: 48,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  searchInput: {
    color: colors.textBlack,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 8,
  },
  registerRequest: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1A1A1D",
    borderRadius: 16,
    marginBottom: 16,
  },
  registerText: {
    color: "white",
    fontSize: 14,
  },
  registerButton: {
    color: "#D2FA00",
    fontSize: 14,
    fontWeight: "bold",
  },
  centerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  centerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  centerAddress: {
    fontSize: 14,
    color: "gray",
  },
  noResults: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
});
