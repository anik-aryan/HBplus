import { Platform } from "react-native";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

// Allowed company domain and whitelisted emails
const ALLOWED_DOMAIN = "@hbplus.fit";
const ALLOWED_EMAILS = ["anikaryan476@gmail.com"];

// Check if user email is allowed
export const isAllowedDomain = (email) => {
  if (!email || typeof email !== "string") {
    return false;
  }
  const normalizedEmail = email.trim().toLowerCase();
  return (
    normalizedEmail.endsWith(ALLOWED_DOMAIN) ||
    ALLOWED_EMAILS.includes(normalizedEmail)
  );
};

// Google sign-in (works on web and mobile)
export const signInWithGoogle = async () => {
  try {
    if (!auth) {
      return {
        user: null,
        authorized: false,
        error: "Firebase Auth is not initialized. Please check that your .env file is loaded properly.",
      };
    }
    if (Platform.OS === "web") {
      return await _webGoogleSignIn();
    } else {
      return await _nativeGoogleSignIn();
    }
  } catch (err) {
    console.error("[auth] signInWithGoogle error:", err);
    return {
      user: null,
      authorized: false,
      error: _friendlyError(err),
    };
  }
};

// Web: popup sign-in
async function _webGoogleSignIn() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  let result;
  try {
    result = await signInWithPopup(auth, provider);
  } catch (err) {
    // User closed the popup, don't show an error
    if (
      err.code === "auth/popup-closed-by-user" ||
      err.code === "auth/cancelled-popup-request"
    ) {
      return { user: null, authorized: false, error: null };
    }
    throw err;
  }

  return _evaluateUser(result.user);
}

// Mobile: native Google sign-in
async function _nativeGoogleSignIn() {
  // Dynamic import so web doesn't try to load native package
  const { GoogleSignin, statusCodes } = await import(
    "@react-native-google-signin/google-signin"
  );

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    offlineAccess: false,
  });

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();

    // Exchange Google token for Firebase credential
    const { idToken } = userInfo.data ?? userInfo;
    const credential = GoogleAuthProvider.credential(idToken);
    const firebaseResult = await signInWithCredential(auth, credential);

    return _evaluateUser(firebaseResult.user);
  } catch (err) {
    if (err.code === statusCodes.SIGN_IN_CANCELLED) {
      return { user: null, authorized: false, error: null };
    }
    if (err.code === statusCodes.IN_PROGRESS) {
      return {
        user: null,
        authorized: false,
        error: "Sign-in already in progress. Please wait.",
      };
    }
    if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return {
        user: null,
        authorized: false,
        error: "Google Play Services are not available on this device.",
      };
    }
    throw err;
  }
}

// Verify domain and kick out unauthorized accounts
async function _evaluateUser(user) {
  if (!user) {
    return { user: null, authorized: false, error: "Sign-in failed. No user returned." };
  }

  const email = user.email;

  if (!email) {
    await _safeSignOut();
    return {
      user: null,
      authorized: false,
      error: "Access restricted. Please login using your official domain email.",
    };
  }

  if (!user.emailVerified) {
    await _safeSignOut();
    return {
      user: null,
      authorized: false,
      error: "Your email address has not been verified.",
    };
  }

  // Check allowed domain or email list
  if (!isAllowedDomain(email)) {
    await _safeSignOut();
    return {
      user: null,
      authorized: false,
      error: "Access restricted. Please login using your official domain email.",
    };
  }

  return { user, authorized: true, error: null };
}

// Sign out from Firebase and Google
export const logout = async () => {
  try {
    if (Platform.OS !== "web") {
      try {
        const { GoogleSignin } = await import(
          "@react-native-google-signin/google-signin"
        );
        await GoogleSignin.signOut();
      } catch {
        // Ignore native sign-out error
      }
    }
    await signOut(auth);
  } catch (err) {
    console.error("[auth] logout error:", err);
    throw err;
  }
};

// Quick sign-out helper
async function _safeSignOut() {
  try {
    await signOut(auth);
  } catch {
    // Ignore error
  }
}

// Map Firebase error codes to friendly text
function _friendlyError(err) {
  if (!err) return "Authentication failed. Please try again.";

  switch (err.code) {
    case "auth/operation-not-allowed":
      return "Google Sign-in is not enabled in Firebase Console. Go to Authentication → Sign-in method → Enable Google.";
    case "auth/unauthorized-domain":
      return "This domain (localhost) is not authorized in Firebase Console. Go to Authentication → Settings → Authorized domains.";
    case "auth/invalid-api-key":
      return "Invalid Firebase API key in .env. Please check your Firebase configuration.";
    case "auth/popup-blocked":
      return "Popup was blocked by your browser. Please allow popups for this site.";
    case "auth/popup-closed-by-user":
      return null;
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    default:
      return err.message || err.code || "Authentication failed. Please try again.";
  }
}

