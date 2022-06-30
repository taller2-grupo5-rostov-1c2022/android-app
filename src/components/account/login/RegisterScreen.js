import React, { useState } from "react";
import { Button, ActivityIndicator, Headline } from "react-native-paper";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import PropTypes from "prop-types";
import styles from "../../styles.js";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import { FirebaseError } from "./FirebaseError";
import { emailRegex } from "../../../util/general";
import { View } from "react-native";
import Portal from "../../general/NavigationAwarePortal";

export default function RegisterScreen() {
  const auth = getAuth();
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState(null);

  const register = async (data) => {
    setError(null);
    setAuthing(true);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
    } catch (err) {
      setError(err);
      setAuthing(false);
    }
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
      <Headline style={{ margin: "2%" }}>Join Spotifiuby</Headline>
      <RegisterForm control={control} setFocus={setFocus} />
      <Button
        mode="contained"
        style={[styles.button, styles.formWidth]}
        onPress={handleSubmit(register)}
      >
        Register
      </Button>
      <FirebaseError error={error} />
      <Portal>
        {authing ? (
          <ActivityIndicator size="large" style={styles.activityIndicator} />
        ) : null}
      </Portal>
    </View>
  );
}

function RegisterForm({ control, setFocus }) {
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

RegisterForm.propTypes = {
  control: PropTypes.any.isRequired,
  setFocus: PropTypes.any.isRequired,
};
