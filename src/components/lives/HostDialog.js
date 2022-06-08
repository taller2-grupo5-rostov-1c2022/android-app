import React, { useState } from "react";
import { Dialog, Button, Caption } from "react-native-paper";
import { ScrollView, Dimensions, View } from "react-native";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { inputValidator } from "../../util/general";
import { StorageAccessFramework as SAF } from "expo-file-system";
import ImagePicker from "../formUtil/ImagePicker";
import styles from "../styles";

export default function HostDialog({ hideDialog, user, navigation, ...props }) {
  const { handleSubmit, ...rest } = useForm({
    defaultValues: {
      name: `${user.name}'s Live Stream`,
    },
    mode: "onChange",
  });
  const [saveUri, setSaveUri] = useState(null);

  async function getSaveUri() {
    const uri = await SAF.requestDirectoryPermissionsAsync();
    console.log(decodeURIComponent(uri.directoryUri).split(":"));
    if (uri.granted) setSaveUri(uri.directoryUri);
  }

  const onDismiss = () => {
    setSaveUri(null);
    hideDialog();
  };

  return (
    <Dialog
      onDismiss={onDismiss}
      style={{ maxHeight: Dimensions.get("window").height * 0.8 }}
      {...props}
    >
      <Dialog.Title>Host a Live Stream</Dialog.Title>
      <Dialog.ScrollArea>
        <ScrollView style={{ marginVertical: 5 }}>
          <FormDefinition {...rest}></FormDefinition>
          <Button onPress={getSaveUri}>Save recording</Button>
          <Caption
            style={{
              alignSelf: "center",
              textAlign: "center",
            }}
          >
            <Caption>
              {saveUri
                ? "Recording will be saved to\n"
                : "Recording won't be saved"}
            </Caption>
            <Caption style={styles.bold}>
              {saveUri
                ? `${decodeURIComponent(saveUri).split(":").slice(-1)}`
                : null}
            </Caption>
          </Caption>
        </ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <View style={styles.row}>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button
            onPress={handleSubmit(async (formData) => {
              navigation.replace("HostingLiveScreen", {
                uid: user?.id,
                saveUri: saveUri,
                name: formData.name,
                img: formData?.img,
              });
            })}
          >
            Start
          </Button>
        </View>
      </Dialog.Actions>
    </Dialog>
  );
}

function FormDefinition(props) {
  return (
    <FormBuilder
      {...props}
      formConfigArray={[
        {
          name: "img",
          type: "custom",
          JSX: ImagePicker,
          customProps: {
            shape: "circle",
            icon: "antenna",
            size: 200,
            style: { alignSelf: "center" },
          },
        },
        {
          type: "text",
          name: "name",
          rules: {
            validate: inputValidator("Name is required"),
          },
          textInputProps: {
            mode: "flat",
            label: "Live stream name",
            style: styles.textInput,
          },
        },
      ]}
    />
  );
}

HostDialog.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  hideDialog: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
