export const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
export const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";
export const googleWebClientId =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "";
export const googleIosClientId =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "";

export const storageUrl = `${supabaseUrl}/storage/v1/object/public`;

export const webviewUrl = process.env.EXPO_PUBLIC_WEBVIEW_URL || "";
