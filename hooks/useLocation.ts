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

  useEffect(() => {
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

    initializeLocation();
  }, []);

  return {
    location,
    locationPermission,
    locationError,
    setLocationPermission,
    setLocationError,
  };
};
