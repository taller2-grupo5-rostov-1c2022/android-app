import React from "react";
import { Dialog, Button, ActivityIndicator } from "react-native-paper";
import { ScrollView, View } from "react-native";
import { webApi } from "../util/services";
import PropTypes from "prop-types";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import FilePicker from "./FilePicker";
import styles from "./styles";
import FormData from "form-data";

export default function SongDialog({
  hideDialog,
  song: { id, ...initialData },
}) {
  const { control, setFocus, handleSubmit } = useForm({
    defaultValues: {
      name: initialData ? initialData.name : "",
      artists: initialData ? initialData.artists : "",
      description: initialData ? initialData.description : "",
      file: null,
    },
    mode: "onChange",
  });

  const [loading, setLoading] = React.useState(false);

  const sendRequest = async (requestSender) => {
    setLoading(true);
    await requestSender();
    hideDialog();
  };

  if (loading)
    return <ActivityIndicator size="large" style={styles.activityIndicator} />;

  return (
    <Dialog visible="true" onDismiss={hideDialog}>
      <Dialog.Title>Edit Song</Dialog.Title>
      <Dialog.Content>
        <ScrollView>
          <FormDefinition
            control={control}
            setFocus={setFocus}
            creating={id == null}
          ></FormDefinition>
        </ScrollView>
      </Dialog.Content>
      <Dialog.Actions>
        <View style={{ flexDirection: "row" }}>
          <Button onPress={hideDialog}>Cancel</Button>
          <DeleteButton songKey={id} sendRequest={sendRequest} />
          <SaveButton
            songKey={id}
            handleSubmit={handleSubmit}
            sendRequest={sendRequest}
          />
        </View>
      </Dialog.Actions>
    </Dialog>
  );
}

function SaveButton({ songKey, handleSubmit, sendRequest }) {
  const onSave = async (data) => {
    sendRequest(async () => {
      console.log("Saving song " + data.name);

      const response = await saveRequest(songKey, data);

      response.json().then((response) => {
        console.log("Song saved. Received response: ", response);
      });
    });
  };

  return <Button onPress={handleSubmit((data) => onSave(data))}>Save</Button>;
}

function DeleteButton({ songKey, sendRequest }) {
  if (songKey == null) return null;

  const onDelete = async () => {
    sendRequest(async () => {
      console.log("Deleting song with key " + songKey);

      const response = await fetch(webApi + "/songs/" + songKey, {
        method: "DELETE",
      });

      response.json().then((data) => {
        console.log("Song deleted. Received response: ", data);
      });
    });
  };

  return <Button onPress={onDelete}>Delete</Button>;
}

async function saveRequest(songKey, formData) {
  var body = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    body.append(key, value);
    console.log(key, ": ", value);
  });
  body.append("creator", "tmp");
  console.log(body);
  const data = {
    method: songKey ? "PUT" : "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    body: body,
  };

  return fetch(
    webApi + "/songs/" + (songKey ? "?song_id=" + songKey : ""),
    data
  );
}

function FormDefinition({ creating, ...rest }) {
  return (
    <FormBuilder
      {...rest}
      formConfigArray={[
        {
          type: "text",
          name: "name",
          rules: {
            required: {
              value: creating,
              message: "Name is required",
            },
          },
          textInputProps: {
            mode: "flat",
            label: "Song name",
          },
        },
        {
          type: "text",
          name: "artists",
          rules: {
            required: {
              value: creating,
              message: "Authors are required",
            },
          },
          textInputProps: {
            mode: "flat",
            label: "Song authors",
          },
        },
        {
          type: "text",
          name: "description",
          rules: {
            required: {
              value: creating,
              message: "Description is required",
            },
          },
          textInputProps: {
            mode: "flat",
            label: "Song description",
          },
        },
        {
          name: "file",
          type: "custom",
          JSX: FilePicker,
          customProps: {
            label: "Songs file",
            fileType: "audio/*",
          },
          rules: {
            required: {
              value: creating,
              message: "File is required",
            },
          },
        },
      ]}
    />
  );
}

SongDialog.propTypes = {
  hideDialog: PropTypes.func,
  song: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    description: PropTypes.string,
    artists: PropTypes.string,
  }),
};

FormDefinition.propTypes = {
  creating: PropTypes.bool,
};

SaveButton.propTypes = {
  songKey: PropTypes.any,
  handleSubmit: PropTypes.func,
  sendRequest: PropTypes.func,
};

DeleteButton.propTypes = {
  songKey: PropTypes.any,
  sendRequest: PropTypes.func,
};
