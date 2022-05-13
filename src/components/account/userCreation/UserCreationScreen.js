import React, { useEffect, useState } from "react";
import styles from "../../styles.js";
import { getAuth } from "firebase/auth";
import { webApi, fetch } from "../../../util/services.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { FormBuilder } from "react-native-paper-form-builder";
import UserImagePicker from "../../formUtil/ImagePicker";
import { Button, ActivityIndicator, Title } from "react-native-paper";
import PropTypes from "prop-types";
import { VALID_GENRES } from "../../../util/constants.js";
import Checklist from "../../formUtil/Checklist";
const FormData = global.FormData;

export default function UserCreationScreen({ navigation }) {
  const [loading, setLoading] = useState(true);

  const uid = getAuth()?.currentUser?.uid;

  const onUser = () => {
    navigation.navigate("Home");
  };

  useEffect(async () => {
    if (uid) {
      fetch(webApi + "/songs/users/" + uid)
        .then((res) => res.json())
        .then((res) => {
          if (!res?.id) setLoading(false);
          else onUser();
        })
        .catch(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);

    let { image, preferences, ...rest } = data;
    let body = new FormData();
    Object.entries(rest).forEach(([key, value]) => body.append(key, value));
    if (image) body.append("img", image, "pfp");
    if (preferences) body.append("interests", JSON.stringify(preferences));

    try {
      let data = await fetch(webApi + "/songs/users/", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body,
      });
      data = await data.json();
      if (data.id) onUser();
      else setLoading(false);
    } catch (e) {
      toast.show("Error logging in, please try again later", {
        duration: 3000,
      });
      navigation.replace("Login");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, styles.containerCenter].concat(
        loading ? styles.disabled : []
      )}
      pointerEvents={loading ? "none" : "auto"}
    >
      {loading ? (
        <ActivityIndicator size="large" style={styles.activityIndicator} />
      ) : (
        <UserForm onSubmit={onSubmit} />
      )}
    </SafeAreaView>
  );
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
            JSX: UserImagePicker,
            customProps: {
              initialImageUri: defaultValues?.image ?? undefined,
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
                title: name,
              })),
              formProp: "title",
              title: (
                <Title style={{ width: "100%", textAlign: "center" }}>
                  Interests
                </Title>
              ),
              viewProps: {
                style: {
                  alignItems: "flex-start",
                },
              },
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
