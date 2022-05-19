import React from "react";
import { Dialog, Button, ActivityIndicator } from "react-native-paper";
import { ScrollView, View, Dimensions, Text } from "react-native";
import PropTypes from "prop-types";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import styles from "../../styles";
import {
  savePlaylist,
  deletePlaylist,
  removeSongFromPlaylist,
} from "../../../util/requests";
import { ErrorDialog } from "../../general/ErrorDialog";
import { inputValidator } from "../../../util/general";

export default function PlaylistDialog({ hideDialog, data }) {
  const { handleSubmit, ...rest } = useForm({
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
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
          <FormDefinition {...rest} creating={!data?.id}></FormDefinition>
          <PlaylistSongs playlistId={data?.id} songs={data?.songs} />
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

function FormDefinition({ creating, ...rest }) {
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
      ]}
    />
  );
}

// Fixme - This is only a temp implementation to fullfil the requirement
function PlaylistSongs({ playlistId, songs }) {
  if (!playlistId || !songs) return null;

  const deleteSong = async (event, songId) => {
    console.log(event.target, songId);
    try {
      removeSongFromPlaylist(playlistId, songId);
      event.target.remove();
    } catch (err) {
      console.log("Error removing song from playlist", err);
    }
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {songs?.map((song) => (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          key={song.id}
        >
          <Text
            style={{
              fontSize: 16,
              margin: 8,
            }}
          >
            {song.name}
          </Text>
          <Button onPress={(e) => deleteSong(e, song.id)}>DELETE</Button>
        </View>
      ))}
    </View>
  );
}
PlaylistSongs.propTypes = {
  playlistId: PropTypes.number,
  songs: PropTypes.array,
};

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
};
