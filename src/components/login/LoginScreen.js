import React, { useState } from "react";
import { Image, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Subheading,
  Headline,
  Button,
  Portal,
  ActivityIndicator,
} from "react-native-paper";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import PropTypes from "prop-types";
import styles from "../styles.js";
import ExternalView from "../ExternalView.js";
import image from "../../img/logo.png";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import { LoginError } from "./LoginError";

export default function LoginScreen({ navigation }) {
  const auth = getAuth();
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState(null);

  const signIn = async (method) => {
    setError(null);
    setAuthing(true);
    try {
      await method();
      navigation.replace("Home");
    } catch (err) {
      setError(err);
      setAuthing(false);
    }
  };

  const signInWithGoogle = async () => {
    return signIn(() => signInWithPopup(auth, new GoogleAuthProvider()));
  };

  const signInWithEmail = async (credentials) => {
    return signIn(() =>
      signInWithEmailAndPassword(auth, credentials.email, credentials.password)
    );
  };

  const { handleSubmit, control, setFocus } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <ExternalView
      style={[styles.container, styles.containerCenter].concat(
        authing ? styles.disabled : []
      )}
      pointerEvents={authing ? "none" : "auto"}
    >
      <Image source={image} style={styles.bigLogo} />
      <Headline>Spotifiuby</Headline>
      <Subheading>Log In</Subheading>
      <LoginForm control={control} setFocus={setFocus} />
      <View style={[styles.row, styles.formWidth]}>
        <Button
          mode="contained"
          style={[{ flex: 1 }, styles.button]}
          onPress={() => navigation.push("RegisterScreen")}
        >
          Register
        </Button>
        <Button
          onPress={handleSubmit(signInWithEmail)}
          mode="contained"
          style={[{ flex: 1 }, styles.button]}
        >
          Log in
        </Button>
      </View>
      <Button onPress={() => signInWithGoogle()} style={styles.button}>
        Sign in with Google
      </Button>
      <LoginError error={error} />
      <StatusBar style="auto" />
      <Portal>
        {authing ? (
          <ActivityIndicator size="large" style={styles.activityIndicator} />
        ) : null}
      </Portal>
    </ExternalView>
  );
}

function LoginForm({ control, setFocus }) {
  return (
    <FormBuilder
      control={control}
      setFocus={setFocus}
      formConfigArray={[
        {
          type: "email",
          name: "email",
          rules: { required: { value: true, message: "Email required" } },
          pattern: {
            value:
              /[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/,
            message: "Email is invalid",
          },
          textInputProps: {
            mode: "flat",
            label: "Email",
            style: styles.formWidth,
          },
        },
        {
          type: "password",
          name: "password",
          rules: { required: { value: true, message: "Password required" } },
          textInputProps: {
            mode: "flat",
            label: "Password",
            style: styles.formWidth,
          },
        },
      ]}
    />
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
};

LoginForm.propTypes = {
  control: PropTypes.any.isRequired,
  setFocus: PropTypes.any.isRequired,
};
