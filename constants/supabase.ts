// Table names
export const TABLES = {
  USER: "User",
  TERMS_AGREEMENT: "TermsAgreement",
};

// User table fields
export const USER_FIELDS = {
  ID: "id",
  EMAIL: "email",
  NICKNAME: "nickname",
  AVATAR_URL: "avatar_url",
  CREATED_AT: "created_at",
};

// TermsAgreement table fields
export const TERMS_AGREEMENT_FIELDS = {
  ID: "id",
  USER_ID: "user_id",
  SERVICE: "service",
  PRIVACY: "privacy",
  MARKETING: "marketing",
  CREATED_AT: "created_at",
};

export const STORAGE_PATHS = {
  AVATARS: "avatars",
};
