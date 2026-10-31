import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import { useAuth } from "../src/AuthContext";
import { signInWithGoogle } from "../src/auth";

// Google logo (SVG for web, circle fallback on native)
function GoogleIcon() {
  if (Platform.OS === "web") {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 48 48"
        style={{ marginRight: 10 }}
        aria-hidden="true"
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        />
        <path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
        <path fill="none" d="M0 0h48v48H0z" />
      </svg>
    );
  }
  return <View style={styles.nativeGoogleDot} />;
}

export default function LoginPage() {
  const { status, error: contextError } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [localError, setLocalError] = useState(null);

  if (status === "loading") {
    return (
      <View style={styles.centered} testID="loading-screen">
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  // Display either the action error or unauthorized message from context
  const displayError = localError || (status === "unauthorized" ? contextError : null);

  const handleLogin = async () => {
    setLocalError(null);
    setSigningIn(true);
    try {
      const result = await signInWithGoogle();
      if (result.error) {
        setLocalError(result.error);
      }
    } catch {
      setLocalError("Authentication failed. Please try again.");
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
      testID="login-screen"
    >
      <View style={styles.card}>
        <View style={styles.brandRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>HB+</Text>
          </View>
        </View>

        <Text style={styles.heading}>HB Plus</Text>
        <Text style={styles.subheading}>Employee Portal</Text>

        <View style={styles.divider} />

        <Text style={styles.notice}>
          Access is restricted to{" "}
          <Text style={styles.domain}>@hbplus.fit</Text> accounts only.{"\n"}
          Please sign in with your official company Google account.
        </Text>

        {displayError ? (
          <View style={styles.errorBanner} testID="error-banner">
            <Text style={styles.errorText}>{displayError}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.button, signingIn && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={signingIn}
          activeOpacity={0.85}
          testID="google-signin-button"
          accessibilityLabel="Login with Google"
          accessibilityRole="button"
        >
          {signingIn ? (
            <ActivityIndicator
              size="small"
              color="#fff"
              testID="signin-spinner"
            />
          ) : (
            <>
              <GoogleIcon />
              <Text style={styles.buttonText}>Login with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footer}>
          Unauthorized access is prohibited.{"\n"}
          Only official @hbplus.fit accounts are permitted.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: "#f5f7fa",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 48,
    paddingHorizontal: 40,
    alignItems: "center",
    width: "100%",
    maxWidth: 420,
    // Web shadow
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.10,
          shadowRadius: 12,
          elevation: 6,
        }),
  },
  brandRow: {
    marginBottom: 16,
    alignItems: "center",
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: "#1a73e8",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 4,
    textAlign: "center",
  },
  subheading: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 0,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    width: "100%",
    marginVertical: 24,
  },
  notice: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  domain: {
    fontWeight: "700",
    color: "#1a73e8",
  },
  errorBanner: {
    backgroundColor: "#fef2f2",
    borderColor: "#fca5a5",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    width: "100%",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a73e8",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: "100%",
    minHeight: 50,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  nativeGoogleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EA4335",
    marginRight: 10,
  },
  footer: {
    marginTop: 28,
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 18,
  },
});
