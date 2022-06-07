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

export default function ListeningLiveScreen({ navigation, route }) {
  const stream = useContext(StreamContext);
  const { hostName, hostId, token } = route.params;

  useEffect(() => {
    stream.startListening(hostId, token);
    return stream.stop;
  }, []);

  if (!stream.joined)
    return (
      <View style={[styles.container, styles.containerCenter]}>
        <ActivityIndicator style={styles.activityIndicator} />
      </View>
    );

  return (
    <View style={[styles.container, styles.containerCenter]}>
      <IconButton icon="access-point" size={300} />
      <Subheading>Listening to {hostName}&apos;s live stream</Subheading>
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

ListeningLiveScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      hostName: PropTypes.string.isRequired,
      hostId: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
