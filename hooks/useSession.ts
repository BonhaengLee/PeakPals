import { useEffect, useState } from "react";

import { supabase } from "../utils/supabase";

export const useSession = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData?.session || null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return session;
};
