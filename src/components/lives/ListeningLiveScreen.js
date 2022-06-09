import React, { useEffect, useContext, useState } from "react";
import { View } from "react-native";
import { Title, ActivityIndicator, Button } from "react-native-paper";
import styles from "../styles";
import PropTypes from "prop-types";
import { StreamContext } from "./StreamProvider";
import { ShapedImage } from "../general/ShapedImage";
import { useSWRConfig } from "swr";
import { STREAMINGS_URL } from "../../util/services";

export default function ListeningLiveScreen({ navigation, route }) {
  const stream = useContext(StreamContext);
  const [hostJoined, setHostJoined] = useState(true);
  const { name, hostId, token, img_uri } = route.params;
  const { mutate } = useSWRConfig();

  useEffect(() => {
    let sub_error = stream?.engine?.addListener("Error", () => {
      toast.show("Live stream error");
      navigation.goBack();
    });
    let sub_host = stream?.engine?.addListener("UserOffline", () =>
      setHostJoined(false)
    );

    stream.startListening(hostId, token);
    return () => {
      stream.stop();
      sub_error?.remove();
      sub_host?.remove();
    };
  }, []);

  useEffect(() => {
    if (!hostJoined) {
      hostLeft();
    }
  }, [hostJoined]);

  async function hostLeft() {
    await mutate(STREAMINGS_URL, null);
    toast.show("Live stream ended");
    navigation.goBack();
  }

  if (!stream.joined)
    return (
      <View style={[styles.container, styles.containerCenter]}>
        <ActivityIndicator style={styles.activityIndicator} />
      </View>
    );

  return (
    <View style={[styles.container, styles.containerCenter]}>
      <ShapedImage
        icon="access-point"
        shape="circle"
        size={200}
        imageUri={img_uri}
      />
      <Title style={{ marginVertical: "5%" }}>{name}</Title>
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
      name: PropTypes.string.isRequired,
      hostId: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
      img_uri: PropTypes.string,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
