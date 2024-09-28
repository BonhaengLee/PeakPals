import { SavedCenter, SimplifiedCenter } from "../types";

// FIXME: mock data
export const savedCenters: SavedCenter[] = [
  {
    id: 1,
    name: "클라이밍 센터 1",
    address: "서울특별시 강남구 테헤란로 123",
    visitCount: 12,
    isSaved: true,
  },
  {
    id: 2,
    name: "클라이밍 센터 2",
    address: "서울특별시 강남구 테헤란로 123",
    visitCount: 12,
    isSaved: true,
  },
  {
    id: 3,
    name: "클라이밍 센터 3",
    address: "서울특별시 강남구 테헤란로 123",
    visitCount: 12,
    isSaved: false,
  },
  {
    id: 4,
    name: "클라이밍 센터 4",
    address: "서울특별시 강남구 테헤란로 123",
    visitCount: 122,
    isSaved: false,
  },
  {
    id: 5,
    name: "클라이밍 센터 5",
    address: "서울특별시 강남구 테헤란로 123",
    visitCount: 132,
    isSaved: false,
  },
  {
    id: 6,
    name: "클라이밍 센터 6",
    address: "서울특별시 강남구 테헤란로 123",
    visitCount: 412,
    isSaved: false,
  },
];

// mock nearby centers
export const nearbyCenters: SimplifiedCenter[] = [
  {
    id: 4,
    name: "내 주변 센터 1",
    address: "서울특별시 강남구 역삼동 456",
  },
  {
    id: 5,
    name: "내 주변 센터 2",
    address: "서울특별시 강남구 논현동 789",
  },
  {
    id: 6,
    name: "내 주변 센터 3",
    address: "서울특별시 강남구 삼성동 123",
  },
];
