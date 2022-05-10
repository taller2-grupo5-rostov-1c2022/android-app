import React, { useState } from "react";
import { Button, Caption, Title, Text } from "react-native-paper";
import { View } from "react-native";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";
import * as DocumentPicker from "expo-document-picker";
import styles from "./styles";

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
            buttonComponent: <Button>Pick file</Button>,
          }}
        />
        <Caption>{fileName ?? "No file selected"}</Caption>
      </View>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
}

// File picker para usar con los forms
export function FilePicker(props) {
  const {
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
<<<<<<< Updated upstream:src/components/FilePicker.js
    customProps: { label, fileType, onPick },
=======
    customProps: { fileType, setFileName, setError, buttonComponent },
>>>>>>> Stashed changes:src/components/manageSongs/FilePicker.js
  } = props;

  const { field } = useController({
    name,
    rules,
    shouldUnregister,
    defaultValue,
    control,
  });

  const err = control.getFieldState(name).error?.message;

  const getFile = async () => {
    let { type, name, uri, mimeType } = await DocumentPicker.getDocumentAsync({
      type: fileType,
      // copyToCacheDirectory: true,
    });

    if (type != "success") return;

    if (!mimeType || !mimeType.match(fileType)) {
      setError("Invalid file type");
      setFileName(null);
      field.onChange(null);
      return;
    }

<<<<<<< Updated upstream:src/components/FilePicker.js
    setErrorMsg(null);
    let file = { name, uri, type: mimeType };
    field.onChange(file);
    onPick(file);
    setCaption(name);
=======
    setError(null);
    field.onChange({ name, uri, type: mimeType });
    setFileName(name);
>>>>>>> Stashed changes:src/components/manageSongs/FilePicker.js
  };

  setError((prev) => prev ?? err);

  return <buttonComponent onPress={getFile} />;
}

FilePicker.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.any,
  shouldUnregister: PropTypes.any,
  defaultValue: PropTypes.any,
  control: PropTypes.any,
  customProps: PropTypes.any,
};
