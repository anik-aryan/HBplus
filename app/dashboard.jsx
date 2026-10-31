import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../src/AuthContext";

// Fallback to initials if user doesn't have a profile image
function Avatar({ uri, name }) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (uri) {
    return <Image source={{ uri }} style={styles.avatar} />;
  }
  return (
    <View style={[styles.avatar, styles.avatarFallback]}>
      <Text style={styles.avatarInitials}>{initials}</Text>
    </View>
  );
}

export default function DashboardPage() {
  const { status, user, logout } = useAuth();

  if (status === "loading") {
    return (
      <View style={styles.centered} testID="dashboard-loading">
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  // Safety check: redirect happens in layout, return null if not authorized
  if (status !== "authorized" || !user) {
    return null;
  }

  const displayName = user.displayName || "User";
  const email = user.email;
  const photoURL = user.photoURL;

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Handled in context
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      testID="dashboard-screen"
    >
      <View style={styles.card}>
        <View style={styles.headerBar}>
          <View style={styles.brandMini}>
            <Text style={styles.brandMiniText}>HB+</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
            testID="logout-button"
            accessibilityLabel="Logout"
            accessibilityRole="button"
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.profileSection}>
          <Avatar uri={photoURL} name={displayName} />
          <Text style={styles.welcomeText}>
            Welcome back,{"\n"}
            <Text style={styles.displayName}>{displayName}</Text>
          </Text>
          <Text style={styles.emailText}>{email}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statusCard}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            Your account is verified and has portal access.
          </Text>
        </View>
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
    paddingVertical: 32,
    paddingHorizontal: 40,
    width: "100%",
    maxWidth: 480,
    ...(Platform.OS === "web"
      ? { boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.10,
          shadowRadius: 12,
          elevation: 6,
        }),
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },
  brandMini: {
    backgroundColor: "#1a73e8",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  brandMiniText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  logoutButton: {
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  logoutText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 24,
  },
  profileSection: {
    alignItems: "center",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 16,
  },
  avatarFallback: {
    backgroundColor: "#1a73e8",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitials: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
  },
  welcomeText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 6,
  },
  displayName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  emailText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    borderColor: "#86efac",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22c55e",
    marginRight: 10,
  },
  statusText: {
    fontSize: 14,
    color: "#15803d",
    fontWeight: "500",
    flex: 1,
  },
});
