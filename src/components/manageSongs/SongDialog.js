import React from "react";
import { Dialog, Button, ActivityIndicator } from "react-native-paper";
import { ScrollView, View } from "react-native";
import PropTypes from "prop-types";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import { SongPicker } from "./SongPicker";
import styles from "../styles";
import { saveRequest, deleteRequest } from "../../util/songRequests";
import { ErrorDialog } from "../ErrorDialog";

export default function SongDialog({ hideDialog, song }) {
  const { control, setFocus, handleSubmit } = useForm({
    defaultValues: {
      name: song?.name ?? "",
      artists: song?.artists ?? "",
      description: song?.description ?? "",
      genre: song?.genre ?? "",
      file: null,
    },
    mode: "onChange",
  });
  const [status, setStatus] = React.useState({ error: null, loading: false });

  if (status.error)
    return <ErrorDialog error={status.error} hideDialog={hideDialog} />;

  if (status.loading)
    return <ActivityIndicator size="large" style={styles.activityIndicator} />;

  const sendRequest = async (requestSender, message) => {
    setStatus((prev) => ({ ...prev, loading: true }));
    try {
      const resp = await requestSender();
      const json = await resp.json();
      if (!resp.ok)
        throw new Error(
          `${resp.statusText} (${resp.status}):\n${JSON.stringify(json.detail)}`
        );

      if (message)
        globalThis.toast.show(message, {
          duration: 3000,
        });
      hideDialog();
    } catch (err) {
      setStatus({ loading: false, error: err });
    }
  };

  return (
    <Dialog visible="true" onDismiss={hideDialog}>
      <Dialog.Title>{song?.id ? "Edit" : "Add"} Song</Dialog.Title>
      <Dialog.Content>
        <ScrollView>
          <FormDefinition
            control={control}
            setFocus={setFocus}
            creating={!song?.id}
          ></FormDefinition>
        </ScrollView>
      </Dialog.Content>
      <Dialog.Actions>
        <View style={styles.row}>
          <Button onPress={hideDialog}>Cancel</Button>
          <Button
            onPress={() =>
              sendRequest(
                async () => await deleteRequest(song?.id),
                "Song deleted"
              )
            }
          >
            Delete
          </Button>
          <Button
            onPress={handleSubmit((data) =>
              sendRequest(
                async () => await saveRequest(song?.id, data),
                "Song saved"
              )
            )}
          >
            Save
          </Button>
        </View>
      </Dialog.Actions>
    </Dialog>
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
            style: styles.textInput,
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
            style: styles.textInput,
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
            style: styles.textInput,
          },
        },
        {
          type: "text",
          name: "genre",
          rules: {
            required: {
              value: creating,
              message: "Genre is required",
            },
          },
          textInputProps: {
            mode: "flat",
            label: "Song genre",
            style: styles.textInput,
          },
        },
        {
          name: "file",
          type: "custom",
          JSX: SongPicker,
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
    genre: PropTypes.string,
  }),
};

FormDefinition.propTypes = {
  creating: PropTypes.bool,
};
