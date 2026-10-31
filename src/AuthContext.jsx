import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { isAllowedDomain, logout as firebaseLogout } from "./auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Listen for login/logout and validate domain
  useEffect(() => {
    if (!auth) {
      setStatus("unauthenticated");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setStatus("unauthenticated");
        setError(null);
        return;
      }

      const email = firebaseUser.email;

      // Kick out if email isn't verified or allowed
      if (!email || !firebaseUser.emailVerified || !isAllowedDomain(email)) {
        firebaseLogout().catch(() => {});
        setUser(null);
        setStatus("unauthorized");
        setError(
          "Access restricted. Please login using your official domain email."
        );
        return;
      }

      setUser(firebaseUser);
      setStatus("authorized");
      setError(null);
    });

    return unsubscribe;
  }, []);

  const logout = useCallback(async () => {
    try {
      await firebaseLogout();
    } catch (err) {
      console.error("[AuthContext] logout error:", err);
    }
  }, []);

  const value = { status, user, error, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to access auth state
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }
  return ctx;
}

