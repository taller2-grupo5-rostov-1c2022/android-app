import React from "react";
import styles from "../styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { Portal, ActivityIndicator, Button } from "react-native-paper";
import { FirebaseError } from "./login/FirebaseError";
import PropTypes from "prop-types";
import { json_fetcher, useSWR, webApi } from "../../util/services.js";
import { UserForm } from "./userCreation/UserCreationScreen.js";

export default function MyProfileScreen() {
  let {
    data: user,
    error,
    isValidating,
  } = useSWR(webApi + "/songs/my_users/", json_fetcher);
  const loading = isValidating && !user && !error;

  const onSubmit = async (data) => {
    console.log("data", data);
  };

  return (
    <SafeAreaView
      style={[styles.container, styles.containerCenter].concat(
        loading ? styles.disabled : []
      )}
      pointerEvents={loading ? "none" : "auto"}
    >
      <UserForm
        onSubmit={onSubmit}
        defaultValues={{
          ...user,
          preferences: JSON.parse(user?.interests ?? "[]"),
          image: user.pfp,
        }}
      />
      <Portal>
        {loading ? (
          <ActivityIndicator size="large" style={styles.activityIndicator} />
        ) : null}
      </Portal>
      <FirebaseError error={error} style={{ textAlign: "center" }} />
    </SafeAreaView>
  );
}

MyProfileScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
