import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { firebaseConfig } from "../config/firebase";
import Stack from "./components/Stack";
import { getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-notifications";

export default function App() {
  React.useEffect(() => {
    async function initializeFirebase() {
      const defaultApp = initializeApp(firebaseConfig);
      initializeAuth(defaultApp, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
    initializeFirebase();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <>
          <Stack />
          <Toast ref={(ref) => (global["toast"] = ref)} />
        </>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3498db",
    accent: "#f1c40f",
  },
};
