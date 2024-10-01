import React, { useRef, useContext, useEffect, forwardRef } from "react";
import {
  NaverMapMarkerOverlay,
  NaverMapView,
  NaverMapViewRef,
} from "@mj-studio/react-native-naver-map";
import { StyleSheet } from "react-native";

import { ClimbingCenter } from "../../types";
import { MapContext } from "../../context/MapContext";

interface MapViewComponentProps {
  centers: ClimbingCenter[];
  handleCenterMarkerClick: (centerId: number) => void;
  location: Location;
}

const MapViewComponent = forwardRef(function MapViewComponent(
  { centers, handleCenterMarkerClick, location }: MapViewComponentProps,
  ref: React.RefObject<NaverMapViewRef>
) {
  const { location: centerLocation } = useContext(MapContext);

  useEffect(() => {
    if (ref.current) {
      ref.current.animateCameraTo({
        latitude: centerLocation.latitude,
        longitude: centerLocation.longitude,
        zoom: 16,
        duration: 800,
      });
    }
  }, [centerLocation]);

  return (
    <NaverMapView
      ref={ref}
      style={styles.map}
      center={{
        latitude: location?.latitude,
        longitude: location?.longitude,
        zoom: 16,
      }}
    >
      {/* 내 위치 - location 없으면 제외 */}
      {location ? (
        <NaverMapMarkerOverlay
          latitude={location?.latitude ?? 0}
          longitude={location?.longitude ?? 0}
          width={24}
          height={24}
          anchor={{ x: 0.5, y: 1 }}
          image={require("../../assets/images/maps/me.png")}
        />
      ) : null}

      {centers.map((center) => (
        <NaverMapMarkerOverlay
          key={center.id}
          latitude={center.latitude}
          longitude={center.longitude}
          width={32}
          height={32}
          anchor={{ x: 0.5, y: 1 }}
          image={require("../../assets/images/maps/center.png")}
          onTap={() => {
            console.log("Marker clicked:", center.id); // 디버깅용 로그
            handleCenterMarkerClick(center.id);
          }}
        />
      ))}
    </NaverMapView>
  );
});

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export default MapViewComponent;
