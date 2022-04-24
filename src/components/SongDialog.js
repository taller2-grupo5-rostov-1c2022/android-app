import React from "react";
import { Dialog, Button, Caption, Title } from "react-native-paper";
import { View, ScrollView } from "react-native";
import { webApi } from "../util/services";
import PropTypes from "prop-types";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";

export default function SongDialog({ hideDialog, songKey, initialData }) {
  const { control, setFocus, handleSubmit } = useForm({
    defaultValues: {
      name: initialData?.name,
      artist_name: initialData?.artist_name,
      description: initialData?.description ?? "No implementado, ignorar",
    },
    mode: "onChange",
  });

  const onSave = async (data) => {
    console.log(`Saving song `, data);
    const response = await fetch(webApi + "/songs/?song_id=" + songKey, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: `{  
        "info": ${JSON.stringify(data)}
        }`,
    });

    response.json().then((data) => {
      console.log(data);
    });

    hideDialog();
  };

  return (
    <Dialog visible="true" onDismiss={hideDialog}>
      <Dialog.Title>Edit Song</Dialog.Title>
      <Dialog.Content>
        <ScrollView>
          <FormBuilder
            control={control}
            setFocus={setFocus}
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
            ]}
          />
          <Title>Song file</Title>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Button type="contained" icon="file-music">
              Pick file
            </Button>
            <Caption>
              {songKey ? "Keep current file" : "No file selected"}
            </Caption>
          </View>
        </ScrollView>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={handleSubmit((data) => onSave(data))}>Save</Button>
      </Dialog.Actions>
    </Dialog>
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
