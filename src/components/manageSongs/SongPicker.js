import React, { useState } from "react";
import { Button, Caption, Title, Text } from "react-native-paper";
import { View } from "react-native";
import styles from "../styles";
import FilePicker from "../FilePicker";

export function SongPicker(props) {
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);

  return (
    <View>
      <Title>Songs</Title>
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
            setFileName,
            setError,
            button: <Button>Pick file</Button>,
          }}
        />
        <Caption>{fileName ?? "No file selected"}</Caption>
      </View>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
}
