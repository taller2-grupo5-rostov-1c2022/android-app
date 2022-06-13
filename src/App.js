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
import * as Notifications from "expo-notifications";
import handleNotification from "./components/notifications/notificationHandler";

export default function App() {
  React.useEffect(() => {
    async function initializeFirebase() {
      const defaultApp = initializeApp(firebaseConfig);
      initializeAuth(defaultApp, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
    initializeFirebase();

    // Handler para cuando la app esta abierta
    Notifications.setNotificationHandler({
      handleNotification,
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
