import React from "react";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles.js";
import { getAuth, signOut } from "firebase/auth";

export default function AccountScreen(logout) {
  const auth = getAuth();
  const onLogOut = () => {
    signOut(auth)
      .then(() => {
        console.log("log out");
        logout && logout();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <SafeAreaView styles={styles.container}>
      <Button
        mode="contained"
        uppercase="true"
        onPress={onLogOut}
        styles={styles.button}
      >
        LOG OUT
      </Button>
    </SafeAreaView>
  );
}
