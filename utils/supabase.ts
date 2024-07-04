import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabaseAnonKey, supabaseUrl } from "./config";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// supabase.auth.onAuthStateChange((event, session) => {
//   console.log("Auth event: ", event);
//   console.log("Auth session: ", session);
// });
