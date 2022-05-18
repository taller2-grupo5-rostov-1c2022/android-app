import React, { useState } from "react";
import { Button, Caption, Title, Text } from "react-native-paper";
import { View } from "react-native";
import FilePicker from "../../formUtil/FilePicker";
import { useTheme } from "react-native-paper";

export function SongPicker(props) {
  const [status, setStatus] = useState(null);
  let theme = useTheme();

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
      <Text style={{ color: theme.colors.error }}>{status?.error}</Text>
    </View>
  );
}
