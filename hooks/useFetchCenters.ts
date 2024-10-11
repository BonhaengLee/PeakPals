import { useCallback, useState, useEffect } from "react";

import { supabase } from "../utils/supabase";
import { ClimbingCenter } from "../types";

export const useFetchCenters = (
  location: { latitude: number; longitude: number } | null
) => {
  const [nearbyCenters, setNearbyCenters] = useState<ClimbingCenter[]>([]);
  const [centers, setCenters] = useState<ClimbingCenter[]>([]);

  console.log({ location });

  // 특정 위치로부터 200m 이내에 있는 센터를 가져오는 함수
  const fetchNearbyCenters = useCallback(async () => {
    if (!location) return;

    // Postgres, postgis를 활용해 위치 기반 필터링을 수행
    const { data, error } = await supabase.rpc("get_nearby_centers", {
      lat: location.latitude,
      lon: location.longitude,
      radius: 2000, // 200m 반경
    });

    if (error) {
      console.error("Error fetching nearby centers:", error);
    } else {
      setNearbyCenters(data || []);
    }
  }, [location]);

  useEffect(() => {
    fetchNearbyCenters();
    const interval = setInterval(fetchNearbyCenters, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location, fetchNearbyCenters]);

  useEffect(() => {
    const fetchCenters = async () => {
      const { data, error } = await supabase.from("ClimbingCenter").select("*");
      if (error) {
        console.error("Error fetching centers:", error);
      } else {
        setCenters(data || []);
      }
    };
    fetchCenters();
  }, []);

  return { nearbyCenters, centers };
};

/*
// FIXME: 로직 확인 필요
const [nearbyCenters, setNearbyCenters] = useState<ClimbingCenter[]>([]);
const fetchNearbyCenters = useCallback(async () => {
  if (!location) return;

  // const { data, error } = await supabase.rpc("nearby_centers", {
  //   lat: parseFloat(location.latitude),
  //   lng: parseFloat(location.longitude),
  //   radius: 2000, // Ensure radius is also a float if required
  // });
  const { data, error } = await supabase
    .from("ClimbingCenter")
    .select("*")
    // 여기에 위치 기반 필터링 로직 추가
    // 예: .filter('latitude', 'gte', location.latitude - 0.1)
    //    .filter('latitude', 'lte', location.latitude + 0.1)
    //    .filter('longitude', 'gte', location.longitude - 0.1)
    //    .filter('longitude', 'lte', location.longitude + 0.1)
    .limit(20); // 적절한 수로 제한

  if (error) {
    console.error("Error fetching nearby centers:", error);
  } else {
    setNearbyCenters(data || []);
  }
}, [location]);

  useEffect(() => {
    if (location) {
      fetchNearbyCenters();
      const interval = setInterval(fetchNearbyCenters, 5 * 60 * 1000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [location, fetchNearbyCenters]);
*/
