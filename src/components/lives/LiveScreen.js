import React, { useState, useContext } from "react";
import { View } from "react-native";
import { Button, TextInput, Subheading } from "react-native-paper";
import PropTypes from "prop-types";
import styles from "../styles.js";
import { StreamContext } from "./StreamProvider";

export default function LiveStream() {
  const [channel, setChannel] = useState("default");
  const context = useContext(StreamContext);

  if (context.joined)
    return (
      <View style={[styles.container, styles.containerCenter]}>
        <Subheading>You are on a live stream</Subheading>
        <Button onPress={context.leaveLivestream}>End Call</Button>
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
          onPress={() => context.startHosting(channel)}
          mode="contained"
          style={[styles.button, { flex: 1 }]}
        >
          Start
        </Button>
        <Button
          onPress={() => context.startListening(channel)}
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
