import React from "react";
import { Dialog, Button } from "react-native-paper";
import { ScrollView, View } from "react-native";
import { webApi } from "../util/services";
import PropTypes from "prop-types";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import FilePicker from "./FilePicker";

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

  return (
    <Dialog visible="true" onDismiss={hideDialog} dismissable={!loading}>
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
          <Button onPress={hideDialog} disabled={loading}>
            Cancel
          </Button>
          <DeleteButton
            songKey={songKey}
            loading={loading}
            sendRequest={sendRequest}
          />
          <SaveButton
            songKey={songKey}
            handleSubmit={handleSubmit}
            loading={loading}
            sendRequest={sendRequest}
          />
        </View>
      </Dialog.Actions>
    </Dialog>
  );
}

function SaveButton({ songKey, handleSubmit, loading, sendRequest }) {
  const onSave = async (data) => {
    sendRequest(async () => {
      console.log("Saving song " + data.name);

      const file = data.file;
      delete data.file;

      const response = await fetch(
        webApi + "/songs/" + (songKey ? "?song_id=" + songKey : ""),
        getRequest(songKey, data, file)
      );

      response.json().then((data) => {
        console.log("Song saved. Received response: ", data);
      });
    });
  };

  return (
    <Button onPress={handleSubmit((data) => onSave(data))} disabled={loading}>
      Save
    </Button>
  );
}

function DeleteButton({ songKey, loading, sendRequest }) {
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

  return (
    <Button disabled={loading} onPress={onDelete}>
      Delete
    </Button>
  );
}

function getRequest(songKey, songData, file) {
  const method = songKey ? "PUT" : "POST";
  const body = { info: songData };

  if (file) {
    body.file = file;
  }

  return {
    method: method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
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
  loading: PropTypes.bool,
  handleSubmit: PropTypes.func,
  sendRequest: PropTypes.func,
};

DeleteButton.propTypes = {
  songKey: PropTypes.string,
  loading: PropTypes.bool,
  sendRequest: PropTypes.func,
};
