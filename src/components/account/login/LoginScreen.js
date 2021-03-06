import { useState } from "react";
import { Image, View } from "react-native";
import {
  Subheading,
  Headline,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import PropTypes from "prop-types";
import styles from "../../styles.js";
import image from "../../../img/logo.png";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import { FirebaseError } from "./FirebaseError";
import { emailRegex } from "../../../util/general";
import { GoogleSignIn } from "./GoogleSignIn.js";
import Portal from "../../general/NavigationAwarePortal";

export default function LoginScreen({ navigation }) {
  const auth = getAuth();
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState(null);

  const signIn = async (method) => {
    setError(null);
    setAuthing(true);
    try {
      await method();
    } catch (err) {
      setError(err);
      setAuthing(false);
    }
  };

  const signInWithEmail = async (credentials) => {
    return signIn(async () => {
      await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
    });
  };

  const { handleSubmit, control, setFocus } = useForm({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <View
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
      <GoogleSignIn onSignIn={signIn} />
      <Button
        onPress={() => navigation.push("ForgotPasswordScreen")}
        style={styles.button}
      >
        Forgot Password
      </Button>
      <FirebaseError error={error} style={{ textAlign: "center" }} />
      <Portal>
        {authing ? (
          <ActivityIndicator size="large" style={styles.activityIndicator} />
        ) : null}
      </Portal>
    </View>
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
          rules: {
            required: { value: true, message: "Email required" },
            pattern: {
              value: emailRegex,
              message: "Email is invalid",
            },
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
