import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

export type RootStackParamList = {
  Home: undefined; // 현재 사용 X -> NavigatorScreenParams<HomeTabParamList>;
  // PostDetails: { id: string };
  NotFound: undefined;
  Login: undefined; // 로그인 페이지 추가
  Terms: undefined; // 약관 동의 페이지 추가
  Profile: undefined; // 프로필 설정 페이지 추가
  BodyInfo: undefined; // 신체 정보 입력 페이지 추가
  CenterSearch: undefined; // 센터 찾기 입력 페이지 추가
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type HomeTabParamList = {
  // Popular: undefined;
  // Latest: undefined;
};

export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<HomeTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
