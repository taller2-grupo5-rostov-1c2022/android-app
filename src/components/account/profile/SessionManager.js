import React, { useEffect, useState } from "react";
import styles from "../../styles.js";
import { getAuth, signOut } from "firebase/auth";
import { webApi, fetch } from "../../../util/services.js";
import { ActivityIndicator, Portal } from "react-native-paper";
import LoadingScreen from "../login/LoadingScreen";
import LoginScreen from "../login/LoginScreen";
import PropTypes from "prop-types";
import UserCreationMenu from "./UserCreationMenu";
import { View } from "react-native";
const FormData = global.FormData;

export default function SessionManager({ navigation }) {
  const [status, setStatus] = useState({
    loading: true,
    fetched: false,
    loggedIn: false,
  });

  const onUser = (name) => {
    let greet = "";
    if (name) greet = `Welcome back, ${name}!`;
    else greet = "Welcome to Spotifiuby!";
    toast.show(greet, {
      duration: 3000,
    });
    navigation.replace("Home");
  };

  const onAuthStateChanged = (user) => {
    if (user?.uid) fetchUser(onUser, setStatus, `${webApi}/songs/my_user/`);
    else setStatus({ loading: false, fetched: false, loggedIn: false });
  };

  useEffect(() => {
    const subscriber = getAuth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
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
    await fetchUser(onUser, setStatus, `${webApi}/songs/users/`, options);
  };

  const onCancel = () => {
    signOut(getAuth()).catch();
  };

  if (status.loading) return <LoadingScreen />;
  if (!status.loggedIn) return <LoginScreen navigation={navigation} />;

  return (
    <View
      style={[styles.container].concat(status.loading ? styles.disabled : [])}
      pointerEvents={status.loading ? "none" : "auto"}
    >
      <UserCreationMenu onSubmit={onSubmit} onCancel={onCancel} />
      <Portal>
        {status.loading && (
          <ActivityIndicator size="large" style={styles.activityIndicator} />
        )}
      </Portal>
    </View>
  );
}

async function fetchUser(onUser, setStatus, url, options) {
  setStatus((prev) => ({ ...prev, loading: true }));
  try {
    let data = await fetch(url, options);
    if (data.id) onUser(data?.name);
    else setStatus({ fetched: true, loading: false, loggedIn: true });
  } catch (e) {
    console.error(e);
    const auth = getAuth();
    if (auth?.currentUser) await signOut(auth);

    toast.show(
      `Error ${
        options ? "creating your account" : "logging you in"
      }, please try again later :(`,
      {
        duration: 3000,
      }
    );
    setStatus((prev) => ({ ...prev, loading: false }));
  }
}

SessionManager.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
