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
    let state = saveUri ? { saveUri } : {};
    let subscription = stream.engine.addListener("Error", () => {
      state.error = true;
      toast.show("Live stream error");
      navigation.goBack();
    });

    start(state);
    return () => {
      subscription.remove();
      stop(state);
    };
  }, []);

  useEffect(() => {
    if (stream.joined) toast.show("Live streaming started");
  }, [stream.joined]);

  async function start(state) {
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
      if (state.saveUri)
        ({ recording: state.recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        ));
      await stream.startHosting(uid, token);
    } catch (e) {
      console.error(e);
      toast.show("Live stream error");
      state.error = true;
      navigation.goBack();
    }
  }

  async function stop(state) {
    try {
      await Promise.all([
        fetch(STREAMINGS_URL, {
          method: "DELETE",
        }),
        stream.stop(),
        (() => {
          state.recording
            ? state.recording.stopAndUnloadAsync()
            : Promise.resolve();
        })(),
      ]);

      if (state.error) return;

      if (state.recording) {
        const uri = await StorageAccessFramework.createFileAsync(
          saveUri,
          getFileName(),
          "audio/mp4"
        );
        const content = await StorageAccessFramework.readAsStringAsync(
          state.recording.getURI(),
          { encoding: EncodingType.Base64 }
        );
        await StorageAccessFramework.writeAsStringAsync(uri, content, {
          encoding: EncodingType.Base64,
        });
        toast.show("Live stream stopped, recording was saved");
      }
      toast.show("Live stream stopped");
    } catch (e) {
      console.error(e);
      if (state.error) return;
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
