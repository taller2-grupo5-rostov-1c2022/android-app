import { useState } from "react";
import styles from "../../styles.js";
import { Portal, ActivityIndicator } from "react-native-paper";
import { FirebaseError } from "../login/FirebaseError";
import PropTypes from "prop-types";
import {
  json_fetcher,
  useSWRImmutable,
  webApi,
  fetch,
} from "../../../util/services.js";
import { UserForm } from "./UserForm";
import { ScrollView, View } from "react-native";
const FormData = global.FormData;

export default function MyProfileScreen() {
  const [_loading, setLoading] = useState(false);
  let {
    data: user,
    error,
    isValidating,
    mutate,
  } = useSWRImmutable(webApi + "/songs/my_user/", json_fetcher);
  // uso el immutable ya que esto se usa solo para popular el formulario al inico
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
      await mutate();
      globalThis.toast.show("Updated Profile", {
        duration: 3000,
      });
    } catch (e) {
      console.error(e);
      globalThis.toast.show("An error has occurred", {
        duration: 3000,
      });
    }

    setLoading(false);
  };

  return (
    <View
      style={[styles.container].concat(loading ? styles.disabled : [])}
      pointerEvents={loading ? "none" : "auto"}
    >
      <ScrollView contentContainerStyle={styles.containerCenter}>
        <UserForm
          onSubmit={onSubmit}
          defaultValues={{
            ...user,
            preferences: JSON.parse(user?.interests),
            image: user.pfp,
          }}
        />
      </ScrollView>

      <Portal>
        {loading ? (
          <ActivityIndicator size="large" style={styles.activityIndicator} />
        ) : null}
      </Portal>
      <FirebaseError error={error} style={{ textAlign: "center" }} />
    </View>
  );
}

MyProfileScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
