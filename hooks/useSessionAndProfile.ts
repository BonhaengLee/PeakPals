import { useEffect } from "react";
import { supabase } from "../utils/supabase";
import { TABLES, USER_FIELDS } from "../constants/supabase";
import { ScreenNames } from "../navigation/types";

interface UseSessionAndProfileProps {
  setInitialRoute: (routeName: ScreenNames) => void;
}

export const useSessionAndProfile = ({
  setInitialRoute,
}: UseSessionAndProfileProps) => {
  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentSession = sessionData?.session;

      if (currentSession) {
        const { data: profileData, error } = await supabase
          .from(TABLES.USER)
          .select("terms_agreed, profile_complete")
          .eq(USER_FIELDS.ID, currentSession.user.id)
          .maybeSingle(); // maybeSingle() 사용

        if (error) {
          console.error("프로필을 가져오는 중 오류 발생:", error.message);
          setInitialRoute("Login"); // 오류 발생 시 로그인으로 되돌아가기
          return;
        }

        if (!profileData) {
          setInitialRoute("Terms");
        } else if (!profileData.terms_agreed) {
          setInitialRoute("Terms");
        } else if (!profileData.profile_complete) {
          setInitialRoute("Profile");
        } else {
          setInitialRoute("HomeStack");
        }
      } else {
        setInitialRoute("Login");
      }
    };

    fetchSessionAndProfile();

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setInitialRoute("Login");
      }
    });
  }, [setInitialRoute]);
};
