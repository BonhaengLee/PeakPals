export interface ClimbingCenter {
  id: number;
  name: string;
  address: string;
  phone?: string;
  setting_day?: string;
  extra_info?: string | null;
  latitude: number;
  longitude: number;
  difficulty_levels?: string; // A string that lists difficulty levels
  endurance_wall?: boolean | null; // Whether endurance wall is available
  foot_wash_area?: boolean | null; // Whether foot wash area is available
  kilter_board?: boolean | null; // Whether kilter board is available
  moon_board?: boolean | null; // Whether moon board is available
  parking?: string | null; // Parking details if available
}

export interface SimplifiedCenter {
  id: number;
  name: string;
  address: string;
}

export interface SavedCenter extends SimplifiedCenter {
  isSaved: boolean;
  // 각 유저별로 다른 값을 가져야 함
  visitCount: number;
}
