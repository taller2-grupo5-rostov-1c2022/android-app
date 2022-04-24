import React from "react";
import { Button, Caption, Title, Text } from "react-native-paper";
import { View } from "react-native";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";
import * as DocumentPicker from "expo-document-picker";

// File picker para usar con los forms
export default function FilePicker(props) {
  console.log(props);
  const {
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
    customProps: { label, fileType },
  } = props;

  const { field } = useController({
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
  });

  const [caption, setCaption] = React.useState(null);

  const getFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: fileType });

    if (result.type === "success") {
      field.onChange(result.uri);
      setCaption(result.name);
    }
  };

  const error = control.getFieldState(name).error;

  return (
    <View>
      <Title>{label}</Title>
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Button type="contained" icon="file-music" onPress={getFile}>
          Pick file
        </Button>
        <Caption>{caption ?? "No file selected"}</Caption>
      </View>
      <Text style={{ color: "#b00020" }}>{error?.message}</Text>
    </View>
  );
}

FilePicker.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.any,
  shouldUnregister: PropTypes.any,
  defaultValue: PropTypes.any,
  control: PropTypes.any,
  customProps: PropTypes.any,
};
