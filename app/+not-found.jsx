import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.code}>404</Text>
      <Text style={styles.message}>This page does not exist.</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  code: {
    fontSize: 72,
    fontWeight: "800",
    color: "#e5e7eb",
    marginBottom: 8,
  },
  message: {
    fontSize: 18,
    color: "#6b7280",
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1a73e8",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
