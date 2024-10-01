import React, { createContext, useState } from "react";
import { ClimbingCenter } from "../types";

interface MapContextProps {
  location: { latitude: number; longitude: number };
  selectedCenter: ClimbingCenter | null;
  updateLocation: (lat: number, lng: number) => void;
  setSelectedCenter: (center: ClimbingCenter | null) => void;
}

export const MapContext = createContext<MapContextProps | null>(null);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState({
    latitude: 37.5665,
    longitude: 126.978,
  });
  const [selectedCenter, setSelectedCenter] = useState<ClimbingCenter | null>(
    null
  );

  const updateLocation = (lat: number, lng: number) =>
    setLocation({ latitude: lat, longitude: lng });

  return (
    <MapContext.Provider
      value={{ location, selectedCenter, updateLocation, setSelectedCenter }}
    >
      {children}
    </MapContext.Provider>
  );
};
