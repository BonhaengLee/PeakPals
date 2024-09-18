// NaverMapComponent.js 또는 NaverMapComponent.tsx

import React from "react";
import { View } from "react-native";
import NaverMapView, {
  NaverMapMarkerOverlay,
  NaverMapCircleOverlay,
  NaverMapPolygonOverlay,
  NaverMapPathOverlay,
  Region,
} from "@mj-studio/react-native-naver-map";

const jejuRegion: Region = {
  latitude: 33.20530773,
  longitude: 126.14656715029,
  latitudeDelta: 0.38,
  longitudeDelta: 0.8,
};

const NaverMapComponent = () => {
  return (
    <NaverMapView
      style={{ flex: 1 }}
      initialRegion={jejuRegion}
      mapType="Basic"
      layerGroups={{
        BUILDING: true,
        BICYCLE: false,
        CADASTRAL: false,
        MOUNTAIN: false,
        TRAFFIC: false,
        TRANSIT: false,
      }}
      isIndoorEnabled={false}
      symbolScale={1.0}
      lightness={0}
      isNightModeEnabled={false}
      isShowCompass={true}
      isShowIndoorLevelPicker={true}
      isShowScaleBar={true}
      isShowZoomControls={true}
      isShowLocationButton={true}
      isExtentBoundedInKorea={true}
      logoAlign={"BottomLeft"}
      locale={"ko"}
      onInitialized={() => console.log("initialized!")}
      onCameraChanged={(args) =>
        console.log(`Camera Changed: ${JSON.stringify(args)}`)
      }
      onTapMap={(args) => console.log(`Map Tapped: ${JSON.stringify(args)}`)}
    >
      <NaverMapMarkerOverlay
        latitude={33.3565607356}
        longitude={126.48599018}
        onTap={() => console.log("Marker tapped")}
        anchor={{ x: 0.5, y: 1 }}
        caption={{
          key: "1",
          text: "Hello",
        }}
        subCaption={{
          key: "1234",
          text: "Sub Caption",
        }}
        width={100}
        height={100}
      />
      <NaverMapCircleOverlay
        latitude={33.17827398}
        longitude={126.349895729}
        radius={50000}
        color={"rgba(255,0,0,0.3)"}
        outlineColor={"rgba(0,0,0,0.5)"}
        outlineWidth={2}
        onTap={() => console.log("Circle tapped")}
      />
      {/* 필요한 경우 다른 오버레이들도 추가 */}
    </NaverMapView>
  );
};

export default NaverMapComponent;
