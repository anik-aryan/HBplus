# HB+ Auth

A cross-platform employee authentication application built using **React Native, Expo and Firebase**. It supports Google Sign-In and restricts access exclusively to users with `@hbplus.fit` email addresses.

## Live Links

- **Web Application:** [https://hbplus-employee-portal.netlify.app/](https://hbplus-employee-portal.netlify.app/)
- **Android APK (Download):** [Google Drive Link](https://drive.google.com/file/d/1SeLpNLD2CYA0EHR46c-Ox2ddMAdeQBDj/view?usp=drivesdk)

## Prerequisites

- Node.js and npm
- Android Studio (for Android emulator)
- Firebase project credentials

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd hbplus-auth
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Firebase credentials:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
```

## Run the Web Application

```bash
npx expo start --web
```

## Run the Android Application

```bash
npx expo start
```

Press `a` to launch the Android emulator or scan the QR code using Expo Go, if supported by the project's native dependencies.

## Run the iOS Application

```bash
npx expo start
```

Press `i` to launch the iOS simulator (macOS with Xcode required).

## Notes

- Enable Google Sign-In in Firebase Console before running the application.
- Add your web deployment domain to Firebase Authorized Domains.
- Never upload your `.env` file to GitHub.
