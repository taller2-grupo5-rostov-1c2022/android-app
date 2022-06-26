import React, { useState, useContext } from "react";
import styles from "../../styles.js";
import { ActivityIndicator } from "react-native-paper";
import PropTypes from "prop-types";
import { SessionContext } from "../../session/SessionProvider";
import { UserForm } from "./UserForm";
import { ScrollView, View } from "react-native";
import { fetch, USERS_URL } from "../../../util/services.js";
import Portal from "../../general/NavigationAwarePortal";
const FormData = global.FormData;

export default function MyProfileScreen() {
  const [loading, setLoading] = useState(false);
  const session = useContext(SessionContext);

  const onSubmit = async (data) => {
    setLoading(true);

    let { image, preferences, ...rest } = data;
    let body = new FormData();
    Object.entries(rest).forEach(([key, value]) => body.append(key, value));
    if (image) body.append("img", image, "pfp");
    if (preferences) body.append("interests", JSON.stringify(preferences));

    try {
      await fetch(USERS_URL + session?.user.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
        },
        body,
      });
      await session?.update();
      globalThis.toast.show("Updated Profile");
    } catch (e) {
      console.error(e);
      globalThis.toast.show("An error has occurred");
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
            ...session?.user,
            preferences: JSON.parse(session?.user?.interests),
            image: session?.user?.pfp,
          }}
        />
      </ScrollView>

      <Portal>
        {loading ? (
          <ActivityIndicator size="large" style={styles.activityIndicator} />
        ) : null}
      </Portal>
    </View>
  );
}

MyProfileScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
