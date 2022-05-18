import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  Portal,
  ActivityIndicator,
  Headline,
} from "react-native-paper";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import PropTypes from "prop-types";
import styles from "../../styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import { FirebaseError } from "./FirebaseError";
import { emailRegex } from "../../../util/general";

export default function ForgotPasswordScreen() {
  const auth = getAuth();
  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const sendReset = async (data) => {
    setError(null);
    setAuthing(true);
    try {
      await sendPasswordResetEmail(auth, data.email);

      setAuthing(false);
      setDone(true);
    } catch (err) {
      setError(err);
      setAuthing(false);
    }
  };

  const { handleSubmit, control, setFocus } = useForm({
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

  return (
    <SafeAreaView
      style={[styles.container, styles.containerCenter].concat(
        authing ? styles.disabled : []
      )}
      pointerEvents={authing ? "none" : "auto"}
    >
      <Headline style={{ margin: "2%" }}>Reset Password</Headline>
      <ResetForm control={control} setFocus={setFocus} />
      {done ? (
        <Headline style={{ margin: "2%" }}>
          Check your email for a reset link.
        </Headline>
      ) : (
        <Button
          mode="contained"
          style={[styles.button, styles.formWidth]}
          onPress={handleSubmit(sendReset)}
        >
          Send Reset Email
        </Button>
      )}
      <FirebaseError error={error} />
      <StatusBar style="auto" />
      <Portal>
        {authing ? (
          <ActivityIndicator size="large" style={styles.activityIndicator} />
        ) : null}
      </Portal>
    </SafeAreaView>
  );
}

function ResetForm({ control, setFocus }) {
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
      ]}
    />
  );
}

ForgotPasswordScreen.propTypes = {};

ResetForm.propTypes = {
  control: PropTypes.any.isRequired,
  setFocus: PropTypes.any.isRequired,
};
