import React, { useEffect, useContext } from "react";
import { View } from "react-native";
import {
  Subheading,
  ActivityIndicator,
  Button,
  IconButton,
} from "react-native-paper";
import styles from "../styles";
import PropTypes from "prop-types";
import { StreamContext } from "./StreamProvider";
import { STREAMINGS_URL, fetch } from "../../util/services";
import { SessionContext } from "../session/SessionProvider";

export default function HostingLiveScreen({ navigation }) {
  const stream = useContext(StreamContext);
  const session = useContext(SessionContext);

  useEffect(() => {
    start();
    return stop;
  }, []);

  async function start() {
    try {
      const token = await fetch(STREAMINGS_URL, {
        method: "POST",
      });
      stream.startHosting(session.user.id, token);
    } catch (e) {
      console.error(e);
      toast.show("Could not start live stream");
      navigation.goBack();
    }
  }

  async function stop() {
    try {
      await Promise.all([
        fetch(STREAMINGS_URL, {
          method: "DELETE",
        }),
        stream.stop(),
      ]);
    } catch (e) {
      console.error(e);
      toast.show("Error stopping live stream");
    }
  }

  if (!stream.joined)
    return (
      <View style={[styles.container, styles.containerCenter]}>
        <ActivityIndicator style={styles.activityIndicator} />
      </View>
    );

  return (
    <View style={[styles.container, styles.containerCenter]}>
      <IconButton icon="access-point" size={300} />
      <Subheading>Hosting a live stream</Subheading>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        Leave
      </Button>
    </View>
  );
}

HostingLiveScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
