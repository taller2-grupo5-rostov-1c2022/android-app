import React, { useState } from "react";
import styles from "../styles.js";
import {
  getAuth,
  updateProfile,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import ExternalView from "../ExternalView.js";
import { useForm } from "react-hook-form";
import { FormBuilder } from "react-native-paper-form-builder";
import { View } from "react-native";
import { emailRegex } from "../../util/regex.js";
import FilePicker from "../FilePicker.js";
import { Button, Portal, ActivityIndicator } from "react-native-paper";
import { FirebaseError } from "./login/FirebaseError";
import PropTypes from "prop-types";
import { UserImage } from "./UserImage.js";

export default function MyProfileScreen({ navigation }) {
  const user = getAuth()?.currentUser;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(user?.photoURL);
  const { control, setFocus, handleSubmit } = useForm({
    defaultValues: {
      image: null,
      displayName: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSave = async (inputs) => {
    setLoading(true);
    try {
      let { email, password, image, displayName } = inputs;
      let photoURL = image?.uri;
      // TODO: Fix subir imagen, no podemos subir la uri de una, hay que hostearla en algun lado
      if (photoURL || displayName)
        await updateProfile(user, {
          ...(displayName ? { displayName } : {}),
          ...(photoURL ? { photoURL } : {}),
        });

      if (email && email != user?.email) await updateEmail(user, email);

      if (password) await updatePassword(user, password);

      await user?.reload();

      navigation.goBack({ user: user });
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  };

  return (
    <ExternalView
      style={[styles.container, styles.containerCenter].concat(
        loading ? styles.disabled : []
      )}
      pointerEvents={loading ? "none" : "auto"}
    >
      <View style={{ marginBottom: "10%" }}>
        <UserImage url={imageUrl} size={200} />
      </View>
      <FormDefinition
        control={control}
        setFocus={setFocus}
        setImageUrl={setImageUrl}
      ></FormDefinition>
      <Button onPress={handleSubmit(onSave)}>Save</Button>
      <Portal>
        {loading ? (
          <ActivityIndicator size="large" style={styles.activityIndicator} />
        ) : null}
      </Portal>
      <FirebaseError error={error} style={{ textAlign: "center" }} />
    </ExternalView>
  );
}

function FormDefinition({ setImageUrl, ...rest }) {
  const user = getAuth()?.currentUser;
  return (
    <FormBuilder
      {...rest}
      formConfigArray={[
        {
          type: "text",
          name: "displayName",
          textInputProps: {
            mode: "flat",
            label: "Display Name",
            style: styles.formWidth,
            placeholder: user?.displayName,
          },
        },
        {
          type: "text",
          name: "email",
          textInputProps: {
            mode: "flat",
            label: "Email",
            style: styles.formWidth,
            placeholder: user?.email,
          },
          rules: {
            pattern: {
              value: emailRegex,
              message: "Email is invalid",
            },
          },
        },
        {
          type: "password",
          name: "password",
          textInputProps: {
            mode: "flat",
            label: "Password",
            style: styles.formWidth,
          },
        },
        {
          name: "image",
          type: "custom",
          JSX: FilePicker,
          customProps: {
            label: "Image",
            fileType: "image/*",
            onPick: (file) => setImageUrl(file.uri),
          },
        },
      ]}
    />
  );
}

MyProfileScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

FormDefinition.propTypes = {
  setImageUrl: PropTypes.func.isRequired,
};
