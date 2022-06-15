import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { firebaseConfig } from "../config/firebase";
import SessionManager from "./components/session/SessionManager";
import { getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-notifications";
import ThemeProvider from "./components/ThemeProvider";
import { setNotificationHandler } from "expo-notifications";
import { defaultHandleNotification } from "./components/notifications/NotificationProvider";

export default function App() {
  React.useEffect(() => {
    async function initializeFirebase() {
      const defaultApp = initializeApp(firebaseConfig);
      initializeAuth(defaultApp, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
    initializeFirebase();

    setNotificationHandler({
      handleNotification: defaultHandleNotification,
    });
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <>
          <SessionManager />
          <Toast ref={(ref) => (global["toast"] = ref)} duration={3000} />
        </>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
