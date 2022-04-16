import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, Headline, Button, TextInput } from "react-native-paper";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PropTypes from "prop-types";
import styles from "./styles.js";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../img/logo.png")} />
      <Headline>Spotifiuby</Headline>
      <Text>Log In</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        secureTextEntry={true}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={styles.input}
      />
      <Button onPress={() => navigation.replace("Home")} mode="contained">
        Log In
      </Button>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
