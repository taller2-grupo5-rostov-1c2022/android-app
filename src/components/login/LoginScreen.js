import React, { useState } from "react";
import { Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Subheading,
  Headline,
  Button,
  Text,
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
import errorMsg from "./firebaseErrors";

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
      setError(errorMsg(err.code));
      console.log("Error code: " + err.code);
      setAuthing(false);
    }
  };

  const signInWithGoogle = async () => {
    return signIn(() => signInWithPopup(GoogleAuthProvider()));
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
      <Button onPress={handleSubmit(signInWithEmail)}>Log in</Button>
      <Button onPress={() => signInWithGoogle()} disabled={authing}>
        Sign in with Google
      </Button>
      <Text style={styles.errorText}>{error}</Text>
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
            style: styles.formTextInput,
          },
        },
        {
          type: "password",
          name: "password",
          rules: { required: { value: true, message: "Password required" } },
          textInputProps: {
            mode: "flat",
            label: "Passowrd",
            style: styles.formTextInput,
          },
        },
      ]}
    />
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

LoginForm.propTypes = {
  control: PropTypes.any.isRequired,
  setFocus: PropTypes.any.isRequired,
};
