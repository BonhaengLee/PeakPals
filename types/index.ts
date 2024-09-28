export interface ClimbingCenter {
  id: number;
  name: string;
  address: string;
  phone?: string;
  setting_day?: string;
  extra_info?: string;
  latitude: number;
  longitude: number;
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
