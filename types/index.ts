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
