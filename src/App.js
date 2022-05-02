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
  React.useEffect(async () => {
    const defaultApp = initializeApp(firebaseConfig);
    initializeAuth(defaultApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
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
/*
const toastConfig = {
  info: (props) => (
    <InfoToast
      {...props}
      style={{
        height: "auto",
        width: "auto",
        maxWidth: "80%",
        alignSelf: "center",
      }}
      contentContainerStyle={{
        alignItems: "center",
        paddingHorizontal: 0,
        marginHorizontal: 0,
      }}
      text1Style={{ textAlign: "center", padding: 10, width: "auto" }}
    />
  ),
};
*/
