import React, { useEffect, useContext } from "react";
import { View } from "react-native";
import { ActivityIndicator, Button, Chip, Title } from "react-native-paper";
import styles from "../styles";
import PropTypes from "prop-types";
import { StreamContext } from "./StreamProvider";
import { STREAMINGS_URL, fetch } from "../../util/services";
import requestRecordPermission from "./permission";
import { Audio } from "expo-av";
import { StorageAccessFramework, EncodingType } from "expo-file-system";
import { toLocalDate } from "../../util/general";
import { ShapedImage } from "../general/ShapedImage";

export default function HostingLiveScreen({ navigation, route }) {
  const { uid, saveUri, name, img } = route.params;
  const stream = useContext(StreamContext);

  useEffect(() => {
    const recording_promise = start(saveUri);
    return () => stop(recording_promise, saveUri);
  }, []);

  async function start() {
    let recording = null;
    try {
      if (!(await requestRecordPermission())) {
        toast.show(
          "You need to grant miscrophone access to host a live stream"
        );
        navigation.goBack();
        return;
      }
      const token = await fetch(STREAMINGS_URL, {
        method: "POST",
        body: getBody(name, img),
      });
      if (saveUri)
        ({ recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        ));
      await stream.startHosting(uid, token);
      toast.show("Live streaming started");
      return recording;
    } catch (e) {
      console.error(e);
      toast.show("Could not start live stream");
      navigation.goBack();
    }
  }

  async function stop(recording_promise, saveUri) {
    try {
      const recording = await recording_promise;
      await Promise.all([
        fetch(STREAMINGS_URL, {
          method: "DELETE",
        }),
        stream.stop(),
      ]);
      if (saveUri && recording) {
        await recording.stopAndUnloadAsync();
        const uri = await StorageAccessFramework.createFileAsync(
          saveUri,
          getFileName(),
          "audio/mp4"
        );
        const content = await StorageAccessFramework.readAsStringAsync(
          recording.getURI(),
          { encoding: EncodingType.Base64 }
        );
        await StorageAccessFramework.writeAsStringAsync(uri, content, {
          encoding: EncodingType.Base64,
        });
        toast.show("Live stream stopped, saved recording");
      } else {
        toast.show("Live stream stopped");
      }
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Chip icon="record" style={{ marginVertical: "5%" }}>
          Broadcasting
        </Chip>
      </View>
      <ShapedImage
        icon="access-point"
        shape="circle"
        size={200}
        imageUri={img?.uri}
      />
      <Title style={{ marginVertical: "5%" }}>{name}</Title>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        stop
      </Button>
    </View>
  );
}

function getFileName() {
  const now = toLocalDate(new Date());
  return now.toISOString().replace(/\D/g, "");
}

function getBody(name, img) {
  const form = new global.FormData();
  form.append("name", name);
  if (img) form.append("img", img, "img");
  return form;
}

HostingLiveScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      uid: PropTypes.string.isRequired,
      saveUri: PropTypes.string,
      name: PropTypes.string.isRequired,
      img: PropTypes.any,
    }).isRequired,
  }).isRequired,
};
