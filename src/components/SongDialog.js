import React from "react";
import { Dialog, Button, ActivityIndicator } from "react-native-paper";
import { ScrollView, View } from "react-native";
import { webApi } from "../util/services";
import PropTypes from "prop-types";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import FilePicker from "./FilePicker";
import styles from "./styles";

export default function SongDialog({ hideDialog, songKey, initialData }) {
  const { control, setFocus, handleSubmit } = useForm({
    defaultValues: {
      name: initialData ? initialData.name : "",
      artist_name: initialData ? initialData.artist_name : "",
      // description: initialData ? initialData.description : "",
      description: "No implementado, ignorar",
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
            fileRequired={songKey == null}
          ></FormDefinition>
        </ScrollView>
      </Dialog.Content>
      <Dialog.Actions>
        <View style={{ flexDirection: "row" }}>
          <Button onPress={hideDialog}>Cancel</Button>
          <DeleteButton songKey={songKey} sendRequest={sendRequest} />
          <SaveButton
            songKey={songKey}
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

      const file = data.file;
      delete data.file;

      const response = await saveRequest(songKey, data, file);

      response.json().then((data) => {
        console.log("Song saved. Received response: ", data);
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

      const response = await fetch(webApi + "/songs/?song_id=" + songKey, {
        method: "DELETE",
      });

      response.json().then((data) => {
        console.log("Song deleted. Received response: ", data);
      });
    });
  };

  return <Button onPress={onDelete}>Delete</Button>;
}

async function saveRequest(songKey, songData, file) {
  const method = songKey ? "PUT" : "POST";
  const body = { info: songData };

  if (file) {
    body.file = file;
  }

  const data = {
    method: method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  return fetch(
    webApi + "/songs/" + (songKey ? "?song_id=" + songKey : ""),
    data
  );
}

function FormDefinition({ fileRequired, ...rest }) {
  return (
    <FormBuilder
      {...rest}
      formConfigArray={[
        {
          type: "text",
          name: "name",
          rules: {
            required: {
              value: true,
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
          name: "artist_name",
          rules: {
            required: {
              value: true,
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
              value: true,
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
              value: fileRequired,
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
  songKey: PropTypes.string,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    artist_name: PropTypes.string,
    description: PropTypes.string,
  }),
};

FormDefinition.propTypes = {
  fileRequired: PropTypes.bool,
};

SaveButton.propTypes = {
  songKey: PropTypes.string,
  handleSubmit: PropTypes.func,
  sendRequest: PropTypes.func,
};

DeleteButton.propTypes = {
  songKey: PropTypes.string,
  sendRequest: PropTypes.func,
};
