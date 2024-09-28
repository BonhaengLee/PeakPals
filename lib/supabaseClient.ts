import { createClient } from "@supabase/supabase-js";

import { supabaseUrl, supabaseAnonKey } from "../utils/config";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
