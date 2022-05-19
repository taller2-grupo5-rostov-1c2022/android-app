import React from "react";
import { Dialog, Button, ActivityIndicator } from "react-native-paper";
import { ScrollView, View, Dimensions } from "react-native";
import Checklist from "../../formUtil/Checklist";

import PropTypes from "prop-types";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import styles from "../../styles";
import { savePlaylist, deletePlaylist } from "../../../util/requests";
import { ErrorDialog } from "../../general/ErrorDialog";
import { inputValidator } from "../../../util/general";

export default function PlaylistDialog({ hideDialog, data }) {
  const songIds = data?.songs?.map((song) => song.id) ?? [];
  const validSongs =
    data?.songs?.map(({ name, id, artists }) => ({
      listProps: {
        title: name,
        description: artists?.map((artist) => artist.name).join(", "),
      },
      out: id,
    })) ?? [];

  const { handleSubmit, ...rest } = useForm({
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      songs_ids: songIds,
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
      await requestSender();

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
      <Dialog.Title>Edit Playlists</Dialog.Title>
      <Dialog.ScrollArea>
        <ScrollView style={{ marginVertical: 5 }}>
          <FormDefinition
            {...rest}
            validSongs={validSongs ?? []}
            creating={!data?.id}
          ></FormDefinition>
        </ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <View style={styles.row}>
          <Button onPress={hideDialog}>Cancel</Button>
          <Button
            onPress={() =>
              sendRequest(
                async () => await deletePlaylist(data?.id),
                "Playlist deleted"
              )
            }
          >
            Delete
          </Button>
          <Button
            onPress={handleSubmit((formData) =>
              sendRequest(
                async () => await savePlaylist(data?.id, formData),
                "Playlist saved"
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

function FormDefinition({ creating, validSongs, ...rest }) {
  console.log(creating);
  return (
    <FormBuilder
      {...rest}
      formConfigArray={[
        {
          type: "text",
          name: "name",
          rules: {
            validate: inputValidator("Name is required"),
          },
          textInputProps: {
            mode: "flat",
            label: "Playlist name",
            style: styles.textInput,
          },
        },
        {
          type: "text",
          name: "description",
          rules: {
            validate: inputValidator("Description is required"),
          },
          textInputProps: {
            mode: "flat",
            label: "Playlist description",
            style: styles.textInput,
          },
        },
        {
          name: "songs_ids",
          type: "custom",
          JSX: Checklist,
          customProps: {
            allOptions: validSongs ?? [],
            title: "Songs",
            emptyMessage: "No songs to add",
          },
        },
      ]}
    />
  );
}

PlaylistDialog.propTypes = {
  hideDialog: PropTypes.func,
  data: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    artists: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ),
    songs: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    genre: PropTypes.string,
    sub_level: PropTypes.number,
  }),
};

FormDefinition.propTypes = {
  creating: PropTypes.bool,
  validSongs: PropTypes.arrayOf(
    PropTypes.shape({
      out: PropTypes.number.isRequired,
      listProps: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,
};
