import image from "../../../img/logo.png";
import styles from "../../styles.js";
import { ActivityIndicator } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { View, Image } from "react-native";

export default function LoadingScreen() {
  return (
    <View style={[styles.container, styles.containerCenter]}>
      <Image source={image} style={styles.bigLogo} />
      <ActivityIndicator
        size="large"
        style={{
          alignItems: "center",
          justifyContent: "center",
          margin: "15%",
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}
