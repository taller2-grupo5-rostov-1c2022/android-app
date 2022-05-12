import React, { useState } from "react";
import { Button, Caption, Title, Text } from "react-native-paper";
import { View } from "react-native";
import styles from "../../styles";
import FilePicker from "../../formUtil/FilePicker";

export function SongPicker(props) {
  const [status, setStatus] = useState(null);

  return (
    <View>
      <Title>Song</Title>
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <FilePicker
          {...props}
          customProps={{
            fileType: "audio/*",
            setStatus,
            button: <Button>Pick file</Button>,
          }}
        />
        <Caption>{status?.fileName ?? "No file selected"}</Caption>
      </View>
      <Text style={styles.errorText}>{status?.error}</Text>
    </View>
  );
}
