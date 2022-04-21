import React, { useState } from "react";
import { Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Headline, Button, TextInput } from "react-native-paper";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import PropTypes from "prop-types";
import styles from "./styles.js";
import TrackPlayer from 'react-native-track-player';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const auth = getAuth();
  const [authing, setAuthing] = useState(false);

  const signInWithGoogle = async () => {
    setAuthing(true);

    signInWithPopup(auth, new GoogleAuthProvider())
      .then((response) => {
        console.log(response.user.uid);
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
        console.log(userCredential);
        navigation.replace("Home");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const music = async () => {
    await TrackPlayer.setupPlayer({});
    TrackPlayer.updateOptions({
      stopWithApp: true
    });
    await TrackPlayer.add({
      url: 'https://x2convert.com/Thankyou?token=U2FsdGVkX1%2fu99lc%2fPk9fKoNi0%2bO5tue8ezg%2bDbF9IG4ipBAkcwV%2fA7MjbLplN4jSIOxJsNMGgMswGs6yhtCDu1bJPdNwHirkA0wLA9WSz%2fM8DPg68okk6n0nzQyEXa%2fzpE86MCiBOCfTcT%2bu31bK5eq7Xek2KGtnhNgw4TsHUSDTllfWdP%2fwycBW60BO25I&s=youtube&id=&h=45242820710516705', // Load media from the network
      title: 'Avaritia',
      artist: 'deadmau5',
      album: 'while(1<2)',
      genre: 'Progressive House, Electro House',
      date: '2014-05-20T07:00:00+00:00', // RFC 3339
      artwork: 'https://picsum.photos/200', // Load artwork from the network
      duration: 4402 // Duration in seconds
  });
  TrackPlayer.play();
  };

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
      <Button onPress={signInWithEmail} mode="contained">
        Log In
      </Button>
      <Button onPress={() => navigation.replace("Home")}>Skip</Button>
      <Button onPress={() => signInWithGoogle()} disabled={authing}>
        Sign in with Google
      </Button>
      <Button onPress={music}>music</Button>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
