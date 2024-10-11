import { useState, useEffect } from "react";

import {
  checkIfLocationServicesEnabled,
  requestLocationPermission,
  startTrackingLocation,
} from "../lib/find-center/locationUtils";

export const useLocation = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null
  );
  const [locationError, setLocationError] = useState<string | null>(null);

  const initializeLocation = async () => {
    const isServiceEnabled = await checkIfLocationServicesEnabled();
    if (!isServiceEnabled) return;

    const hasPermission = await requestLocationPermission(
      setLocationPermission
    );
    if (hasPermission) {
      startTrackingLocation(setLocation, setLocationError);
    }
  };

  useEffect(() => {
    initializeLocation();
  }, []);

  return {
    location,
    locationPermission,
    locationError,
    initializeLocation, // 필요할 때 다시 호출할 수 있도록 반환
    setLocation,
    setLocationPermission,
    setLocationError,
  };
};
