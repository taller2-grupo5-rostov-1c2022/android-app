import React from "react";
import { Dialog, Button, ActivityIndicator } from "react-native-paper";
import { ScrollView, View, Dimensions } from "react-native";
import PropTypes from "prop-types";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import { SongPicker } from "./SongPicker";
import styles from "../../styles";
import { saveAlbum, deleteAlbum } from "../../../util/requests";
import { ErrorDialog } from "../../general/ErrorDialog";
import Table from "../../formUtil/Table";

export default function AlbumDialog({ hideDialog, album }) {
  const { handleSubmit, ...rest } = useForm({
    defaultValues: {
      name: album?.name ?? "",
      description: album?.description ?? "",
      genre: album?.genre ?? "",
      songs: album?.songs,
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
    <Dialog
      visible="true"
      onDismiss={hideDialog}
      style={{ maxHeight: Dimensions.get("window").height * 0.8 }}
    >
      <Dialog.Title>{album?.id ? "Edit" : "Add"} Album</Dialog.Title>
      <Dialog.ScrollArea>
        <ScrollView style={{ marginVertical: 5 }}>
          {/*<FormDefinition {...rest} creating={!song?.id}></FormDefinition>*/}
        </ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <View style={styles.row}>
          <Button onPress={hideDialog}>Cancel</Button>
          <Button
            onPress={() =>
              sendRequest(
                async () => await deleteAlbum(album?.id),
                "Song deleted"
              )
            }
          >
            Delete
          </Button>
          <Button
            onPress={handleSubmit((data) =>
              sendRequest(
                async () => await saveAlbum(album?.id, data),
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
            label: "Album name",
            style: styles.textInput,
          },
        },
        {
          type: "custom",
          name: "artists",
          JSX: Table,
          rules: {
            required: {
              value: creating,
              message: "Authors are required",
            },
          },
          customProps: {
            textInputProps: {
              mode: "flat",
              label: "Author",
              style: styles.textInput,
            },
            addIndex: true,
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
            label: "Album description",
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

AlbumDialog.propTypes = {
  hideDialog: PropTypes.func,
  album: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    description: PropTypes.string,
    genre: PropTypes.string,
    songs: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        artists: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
          }).isRequired
        ),
        genre: PropTypes.string.isRequired,
      })
    ),
  }),
};

FormDefinition.propTypes = {
  creating: PropTypes.bool,
};
