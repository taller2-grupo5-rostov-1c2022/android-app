import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Button, TextInput, Subheading } from "react-native-paper";
import RtcEngine, { ClientRole, ChannelProfile } from "react-native-agora";
import requestRecordPermission from "./permission";
import PropTypes from "prop-types";
import styles from "../styles.js";

// temporal token
const token =
  "00622d869523131488794257a1ec8d9eb2bIAALorouQ1QzKrtts8sdGTKS9lzgaOFF//1TT+WcOKwe4OfdNEwAAAAAEACXVkQupJueYgEAAQCkm55i";
const appId = "22d869523131488794257a1ec8d9eb2b";
const channelName = "spotifiuby";

export default function LiveStream({ navigation }) {
  const [engine, setEngine] = useState(null);
  const [state, setState] = useState({
    joined: false,
    peerIds: [],
  });
  const [channel, setChannel] = useState("default");

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    if (!(await requestRecordPermission())) {
      navigation.goBack();
      return;
    }

    const _engine = await RtcEngine.create(appId);
    setEngine(_engine);
    await _engine.setChannelProfile(ChannelProfile.LiveBroadcasting);

    _engine.addListener("Warning", (warn) => {
      console.log("Warning: ", warn);
    });

    _engine.addListener("Error", (err) => {
      console.log("Error: ", err);
      toast.show("Live stream error");
    });

    _engine.addListener("UserJoined", (uid) => {
      const { peerIds } = state;
      if (peerIds.indexOf(uid) === -1) {
        setState((prev) => ({
          ...prev,
          peerIds: [...peerIds, uid],
        }));
      }
    });

    _engine.addListener("UserOffline", (uid) => {
      const { peerIds } = state;
      setState((prev) => ({
        ...prev,
        peerIds: peerIds.filter((id) => id !== uid),
      }));
    });

    _engine.addListener("JoinChannelSuccess", () => {
      setState((prev) => ({
        ...prev,
        joined: true,
      }));
    });
  };

  const startHosting = async () => {
    await engine?.setClientRole(ClientRole.Broadcaster);
    await engine?.joinChannel(token, channelName, null, 0);
  };

  const startListening = async () => {
    await engine?.setClientRole(ClientRole.Audience);
    await engine?.joinChannel(token, channelName, null, 0);
  };

  const endCall = async () => {
    await engine?.leaveChannel();
    setState((prev) => ({ ...prev, peerIds: [], joined: false }));
  };

  if (state.joined)
    return (
      <View style={[styles.container, styles.containerCenter]}>
        <Subheading>You are on a live stream</Subheading>
        <Button onPress={endCall}>End Call</Button>
      </View>
    );

  return (
    <View style={[styles.container, styles.containerCenter]}>
      <TextInput
        onChangeText={setChannel}
        value={channel}
        style={styles.formWidth}
      ></TextInput>
      <View style={[styles.row, { margin: "5%" }]}>
        <Button
          onPress={startHosting}
          mode="contained"
          style={[styles.button, { flex: 1 }]}
        >
          Start
        </Button>
        <Button
          onPress={startListening}
          mode="contained"
          style={[styles.button, { flex: 1 }]}
        >
          Listen
        </Button>
      </View>
    </View>
  );
}

LiveStream.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
