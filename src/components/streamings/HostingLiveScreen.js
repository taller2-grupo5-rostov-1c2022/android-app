import React, { useEffect, useState, useRef } from "react";
import { View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Chip,
  Title,
  Text,
} from "react-native-paper";
import styles from "../styles";
import PropTypes from "prop-types";
import { STREAMINGS_URL, fetch } from "../../util/services";
import requestRecordPermission from "./permission";
import { Audio } from "expo-av";
import { StorageAccessFramework, EncodingType } from "expo-file-system";
import { toLocalDate } from "../../util/general";
import { ShapedImage } from "../general/ShapedImage";
import useStreamings from "./useStreamings";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function Loading() {
  return (
    <View style={[styles.container, styles.containerCenter]}>
      <ActivityIndicator style={styles.activityIndicator} />
    </View>
  );
}

export default function HostingLiveScreen({ navigation, route }) {
  const [token, setToken] = useState(null);
  const state = useRef({ error: false, recording: null });
  let { name, img, saveUri } = route.params;

  useEffect(() => {
    start();
    return stop;
  }, []);

  async function start() {
    try {
      if (!(await requestRecordPermission())) {
        toast.show("You need to grant microphone access to host a live stream");
        navigation.goBack();
        state.current.error = true;
        return;
      }
      const token = await fetch(STREAMINGS_URL, {
        method: "POST",
        body: getBody(name, img),
      });
      if (saveUri)
        ({ recording: state.current.recording } =
          await Audio.Recording.createAsync(
            Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
          ));

      setToken(token);
    } catch (e) {
      console.error(e);
      toast.show("Live stream error");
      state.current.error = true;
      navigation.goBack();
    }
  }

  async function stop() {
    const recording = state.current.recording;
    try {
      await Promise.all([
        fetch(STREAMINGS_URL, {
          method: "DELETE",
        }),
        (() => {
          recording?.stopAndUnloadAsync() ?? Promise.resolve();
        })(),
      ]);

      if (state.current.error) return;
      if (recording) {
        try {
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
          toast.show("Live stream stopped, recording was saved");
        } catch (e) {
          console.error(e);
          toast.show("Live stream stopped, failed to store recording");
        }
      } else {
        toast.show("Live stream stopped");
      }
    } catch (e) {
      console.error(e);
      if (state.current.error) return;
      toast.show("Error stopping live stream");
    }
  }

  if (!token) return <Loading />;

  return (
    <Hosting
      {...route.params}
      navigation={navigation}
      token={token}
      onError={() => (state.current.error = true)}
    />
  );
}

function Hosting({ uid, name, img, token, navigation, onError }) {
  const { engine, joined } = useStreamings(uid, token, true);
  const [color, setColor] = useState("red");
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const interval = global.setInterval(() => {
      setColor((color) => (color === "red" ? "gray" : "red"));
    }, 1000);
    return () => global.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!engine) return;
    const timeout = { t: null };
    let subscription_err = engine.addListener("Error", () => {
      onError();
      toast.show("Live stream error");
      navigation.goBack();
    });

    let subscription_warn = engine.addListener("Warning", (warn) => {
      if (warn == 1019) {
        if (timeout.t) global.clearTimeout(timeout.t);
        const now = new Date().getTime();
        setAlert(now);
        timeout.t = global.setTimeout(() => {
          setAlert((prev) => {
            if (prev == now) return null;
            return prev;
          });
        }, 15000);
      }
    });

    return () => {
      subscription_err?.remove();
      subscription_warn?.remove();
      if (timeout.t) global.clearTimeout(timeout.t);
    };
  }, [engine]);

  useEffect(() => {
    if (joined) toast.show("Live streaming started");
  }, [joined]);

  if (!joined) return <Loading />;

  return (
    <View style={[styles.container, styles.containerCenter]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Chip
          icon={() => <Icon name="record" color={color} />}
          style={{ marginVertical: "5%" }}
          textStyle={{ fontWeight: "bold" }}
        >
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
      {alert ? (
        <View style={styles.warnBackground}>
          <View style={[styles.row, { alignItems: "center" }]}>
            <Icon
              name="alert"
              style={[styles.warn, { marginRight: 10 }]}
              size={30}
            />
            <Text style={styles.warn}>{"Can't"} detect your microphone.</Text>
          </View>
          <Text
            style={[
              styles.warn,
              {
                alignSelf: "center",
                width: "100%",
                textAlign: "justify",
                fontSize: 12,
                marginTop: 10,
              },
            ]}
          >
            Please check that no other application is using it.
          </Text>
        </View>
      ) : null}
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

Hosting.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  uid: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  img: PropTypes.any,
  onError: PropTypes.func.isRequired,
};
