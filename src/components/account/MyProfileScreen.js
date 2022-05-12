import { useState } from "react";
import styles from "../styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { Portal, ActivityIndicator } from "react-native-paper";
import { FirebaseError } from "./login/FirebaseError";
import PropTypes from "prop-types";
import { json_fetcher, useSWR, webApi, fetch } from "../../util/services.js";
import { UserForm } from "./userCreation/UserCreationScreen.js";
const FormData = global.FormData;

export default function MyProfileScreen() {
  const [_loading, setLoading] = useState(false);
  let {
    data: user,
    error,
    isValidating,
    mutate,
  } = useSWR(webApi + "/songs/my_users/", json_fetcher);
  const loading = _loading || (isValidating && !user && !error);

  const onSubmit = async (data) => {
    setLoading(true);

    let { image, preferences, ...rest } = data;
    let body = new FormData();
    Object.entries(rest).forEach(([key, value]) => body.append(key, value));
    if (image) body.append("img", image, "pfp");
    if (preferences) body.append("interests", JSON.stringify(preferences));

    try {
      await fetch(webApi + "/songs/users/" + user.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
        },
        body,
      });
      globalThis.toast.show("Updated Profile", {
        duration: 3000,
      });
    } catch {
      globalThis.toast.show("An error has occurred", {
        duration: 3000,
      });
    }

    await mutate();
    setLoading(false);
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
          preferences: JSON.parse(user?.interests),
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
