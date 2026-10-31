import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../src/AuthContext";

// Handles redirecting between login and dashboard based on auth state
function RootNavigator() {
  const { status } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (status === "loading") return;

    const inDashboard = segments[0] === "dashboard";

    if (status === "authorized" && !inDashboard) {
      router.replace("/dashboard");
    } else if (status !== "authorized" && inDashboard) {
      router.replace("/");
    }
  }, [status, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

