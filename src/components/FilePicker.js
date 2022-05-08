import React from "react";
import { Button, Caption, Title, Text } from "react-native-paper";
import { View } from "react-native";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";
import * as DocumentPicker from "expo-document-picker";
import styles from "./styles";

// File picker para usar con los forms
export default function FilePicker(props) {
  const {
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
    customProps: { label, fileType, onPick },
  } = props;

  const { field } = useController({
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
  });

  const [caption, setCaption] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);

  const err = control.getFieldState(name).error?.message;

  const getFile = async () => {
    let { type, name, uri, mimeType } = await DocumentPicker.getDocumentAsync({
      type: fileType,
      // copyToCacheDirectory: true,
    });

    if (type != "success") return;

    if (!mimeType || !mimeType.match(fileType)) {
      setErrorMsg("Invalid file type");
      setCaption(null);
      field.onChange(null);
      return;
    }

    setErrorMsg(null);
    let file = { name, uri, type: mimeType };
    field.onChange(file);
    onPick(file);
    setCaption(name);
  };

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
      <Text style={styles.errorText}>{errorMsg ?? err}</Text>
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
