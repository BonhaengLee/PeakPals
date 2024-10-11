import { useEffect, useState } from "react";

import { supabase } from "../utils/supabase";
import { TABLES, USER_FIELDS } from "../constants/supabase";

export const useProfile = (userId: string | null) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const { data: profileData, error } = await supabase
          .from(TABLES.USER)
          .select("terms_agreed, profile_complete")
          .eq(USER_FIELDS.ID, userId)
          .maybeSingle();

        if (error) throw error;
        setProfile(profileData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
};
