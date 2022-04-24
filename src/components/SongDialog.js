import React from "react";
import { Dialog, Button } from "react-native-paper";
import { ScrollView } from "react-native";
import { webApi } from "../util/services";
import PropTypes from "prop-types";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import FilePicker from "./FilePicker";

export default function SongDialog({ hideDialog, songKey, initialData }) {
  const { control, setFocus, handleSubmit } = useForm({
    defaultValues: {
      name: initialData?.name,
      artist_name: initialData?.artist_name,
      description: initialData?.description ?? "No implementado, ignorar",
      file: null,
    },
    mode: "onChange",
  });

  const onSave = async (data) => {
    console.log(`Saving song `, data);
    const file = data.file;
    delete data.file;
    console.log(
      "URL: \n",
      webApi + "/songs/" + (songKey ? "?song_id=" + songKey : "")
    );
    console.log("Request: \n", getRequest(songKey, data, file));

    hideDialog();

    const response = await fetch(
      webApi + "/songs/" + (songKey ? "?song_id=" + songKey : ""),
      getRequest(songKey, data, file)
    );

    response.json().then((data) => {
      console.log(data);
    });
  };

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
        <Button onPress={handleSubmit((data) => onSave(data))}>Save</Button>
      </Dialog.Actions>
    </Dialog>
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
