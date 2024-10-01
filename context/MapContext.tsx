import React, { createContext, useState } from "react";

export const MapContext = createContext<any>(null);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState({
    latitude: 37.5665,
    longitude: 126.978,
  });

  const updateLocation = (lat: number, lng: number) =>
    setLocation({ latitude: lat, longitude: lng });

  return (
    <MapContext.Provider value={{ location, updateLocation }}>
      {children}
    </MapContext.Provider>
  );
};
