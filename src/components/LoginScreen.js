import React, { useState } from "react";
import { Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Text, Headline, Button, TextInput } from "react-native-paper";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import PropTypes from "prop-types";
import styles from "./styles.js";
import { Audio } from "expo-av";
import ExternalView from "./ExternalView.js";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const auth = getAuth();
  const [authing, setAuthing] = useState(false);

  const signInWithGoogle = async () => {
    setAuthing(true);

    signInWithPopup(auth, new GoogleAuthProvider())
      .then((response) => {
        console.log("User UID", response.user.uid);
        navigation.replace("Home");
      })
      .catch((error) => {
        console.log(error);
        setAuthing(false);
      });
  };

  const signInWithEmail = async () => {
    setAuthing(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User UID", userCredential?._tokenResponse?.localId);
        navigation.replace("Home");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const music = async () => {
    const source = {
      uri: "https://storage.googleapis.com/rostov-spotifiuby.appspot.com/songs/1",
    };
    const { sound } = await Audio.Sound.createAsync(source);
    //await sound.loadAsync();
    await sound.playAsync();
  };

  return (
    <ExternalView style={styles.containerCenter}>
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
      <Button onPress={signInWithEmail} mode="contained">
        Log In
      </Button>
      <Button onPress={() => navigation.replace("Home")}>Skip</Button>
      <Button onPress={() => signInWithGoogle()} disabled={authing}>
        Sign in with Google
      </Button>
      <Button onPress={music}>music</Button>
      <StatusBar style="auto" />
    </ExternalView>
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
