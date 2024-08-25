import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { supabase } from "../utils/supabase";

interface AuthProps {
  children: React.ReactNode;
  onLoginSuccess: () => void;
}

export default function Auth({ children, onLoginSuccess }: AuthProps) {
  if (Platform.OS === "ios")
    return (
      <View style={styles.container}>
        {/* 구글 / 카카오 로그인 버튼 추가 */}
        {children}

        <AppleAuthentication.AppleAuthenticationButton
          buttonType={
            AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
          }
          buttonStyle={
            AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE
          }
          cornerRadius={8}
          style={styles.appleButton}
          onPress={async () => {
            try {
              const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                  AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                  AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
              });
              console.log(JSON.stringify(credential, null, 2));

              // Sign in via Supabase Auth.
              if (credential.identityToken) {
                const {
                  error,
                  data: { user },
                } = await supabase.auth.signInWithIdToken({
                  provider: "apple",
                  token: credential.identityToken,
                });
                console.log(JSON.stringify({ error, user }, null, 2));
                if (!error) {
                  // User is signed in.
                  // 애플 로그인 성공 시 약관 동의 페이지로 이동
                  onLoginSuccess();
                }
              } else {
                throw new Error("No identityToken.");
              }
            } catch (e) {
              if (e.code === "ERR_REQUEST_CANCELED") {
                // handle that the user canceled the sign-in flow
              } else {
                // handle other errors
              }
            }
          }}
        />
      </View>
    );
  return (
    <View style={styles.container}>
      {/* Implement Android Auth options. */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16, // 좌우 간격을 추가
    width: "100%", // 전체 너비로 설정
    gap: 16,
    marginBottom: 32,
  },
  appleButton: {
    width: "100%", // 전체 너비로 설정
    height: 44, // 적절한 버튼 높이 설정
  },
});
