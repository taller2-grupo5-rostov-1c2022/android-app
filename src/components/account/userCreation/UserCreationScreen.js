import React, { useEffect, useState } from "react";
import styles from "../../styles.js";
import { getAuth } from "firebase/auth";
import { webApi, fetch } from "../../../util/services.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { FormBuilder } from "react-native-paper-form-builder";
import ImagePicker from "../../formUtil/ImagePicker";
import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";
import LoadingScreen from "../login/LoadingScreen.js";
import PropTypes from "prop-types";
import { VALID_GENRES } from "../../../util/constants.js";
import Checklist from "../../formUtil/Checklist";
const FormData = global.FormData;

export default function UserCreationScreen({ navigation }) {
  const [status, setStatus] = useState({ loading: false, fetched: false });

  const uid = getAuth()?.currentUser?.uid;

  const onUser = () => {
    let user = getAuth()?.currentUser;
    let greet = "";
    if (user?.displayName) greet = `Welcome back, ${user?.displayName}!`;
    else greet = "Welcome to Spotifiuby!";
    toast.show(greet, {
      duration: 3000,
    });
    navigation.navigate("Home");
  };

  useEffect(async () => {
    if (uid) await fetchUser(onUser, setStatus, navigation);
    else setStatus((prev) => ({ ...prev, fetched: true }));
  }, []);

  const onSubmit = async (data) => {
    setStatus((prev) => ({ ...prev, loading: true }));

    let { image, preferences, ...rest } = data;
    let body = new FormData();
    Object.entries(rest).forEach(([key, value]) => body.append(key, value));
    if (image) body.append("img", image, "pfp");
    if (preferences) body.append("interests", JSON.stringify(preferences));

    let options = {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body,
    };

    await fetchUser(onUser, setStatus, navigation, options);
  };

  if (!status.fetched) return <LoadingScreen />;

  return (
    <SafeAreaView
      style={[styles.container, styles.containerCenter].concat(
        status.loading ? styles.disabled : []
      )}
      pointerEvents={status.loading ? "none" : "auto"}
    >
      <UserForm onSubmit={onSubmit} />
    </SafeAreaView>
  );
}

async function fetchUser(onUser, setStatus, navigation, options) {
  try {
    let data = await fetch(
      webApi + (options ? "/songs/users/" : "/songs/my_users/"),
      options
    );
    data = await data.json();
    if (data.id) onUser();
    else setStatus((prev) => ({ ...prev, loading: false }));
  } catch (e) {
    console.error(e);
    toast.show(
      `Error ${
        options ? "creating your account" : "logging you in"
      }, please try again later`,
      {
        duration: 3000,
      }
    );
    navigation.replace("Login");
  }
}

UserCreationScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export function UserForm({ onSubmit, defaultValues }) {
  const { control, setFocus, handleSubmit } = useForm({
    defaultValues: {
      image: null,
      name: defaultValues?.name ?? "",
      location: defaultValues?.location ?? "",
      preferences: defaultValues?.preferences,
    },
    mode: "onChange",
  });

  return (
    <>
      <FormBuilder
        control={control}
        setFocus={setFocus}
        formConfigArray={[
          {
            name: "image",
            type: "custom",
            JSX: ImagePicker,
            customProps: {
              initialImageUri: defaultValues?.image ?? undefined,
              shape: "circle",
              icon: "account",
              size: 200,
            },
          },
          {
            type: "text",
            name: "name",
            textInputProps: {
              mode: "flat",
              label: "User Name",
              style: styles.formWidth,
            },
          },
          {
            type: "text",
            name: "location",
            textInputProps: {
              mode: "flat",
              label: "Location",
              style: styles.formWidth,
            },
          },
          {
            name: "preferences",
            type: "custom",
            JSX: Checklist,
            customProps: {
              allOptions: VALID_GENRES.map((name) => ({
                listProps: { title: name },
                out: name,
              })),
              title: "Interests",
              width: StyleSheet.flatten(styles.formWidth).width,
            },
          },
        ]}
      />
      <Button
        style={{ marginTop: 20 }}
        mode="contained"
        onPress={handleSubmit(onSubmit)}
      >
        Submit
      </Button>
    </>
  );
}

UserForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    location: PropTypes.string,
    preferences: PropTypes.arrayOf(PropTypes.string),
  }),
};
