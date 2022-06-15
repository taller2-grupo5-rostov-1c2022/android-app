import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Title, ActivityIndicator, Button } from "react-native-paper";
import styles from "../styles";
import PropTypes from "prop-types";
import { ShapedImage } from "../general/ShapedImage";
import { useSWRConfig } from "swr";
import { STREAMINGS_URL } from "../../util/services";
import useStreamings from "./useStreamings";

export default function ListeningLiveScreen({ navigation, route }) {
  const { name, hostId, token, img_uri } = route.params;
  const { engine, joined } = useStreamings(hostId, token, false);
  const [hostJoined, setHostJoined] = useState(true);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (!engine) return;
    let sub_error = engine.addListener("Error", () => {
      toast.show("Live stream error");
      navigation.goBack();
    });
    let sub_host = engine.addListener("UserOffline", () => {
      setHostJoined(false);
    });
    return () => {
      sub_error?.remove();
      sub_host?.remove();
    };
  }, [engine]);

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

  if (!joined)
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
