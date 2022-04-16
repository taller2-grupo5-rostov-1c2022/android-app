import React from "react";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles.js";

export default function AccountScreen(logout) {
  return (
    <SafeAreaView styles={styles.container}>
      <Button
        mode="contained"
        uppercase="true"
        onPress={logout}
        styles={styles.button}
      >
        LOG OUT
      </Button>
    </SafeAreaView>
  );
}
