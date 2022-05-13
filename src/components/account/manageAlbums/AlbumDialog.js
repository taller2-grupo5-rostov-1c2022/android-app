import React, { useEffect } from "react";
import { Dialog, Button, ActivityIndicator, Title } from "react-native-paper";
import { ScrollView, View, Dimensions } from "react-native";
import PropTypes from "prop-types";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import styles from "../../styles";
import { saveAlbum, deleteAlbum } from "../../../util/requests";
import { VALID_GENRES, VALID_SUB_LEVELS } from "../../../util/constants";
import { ErrorDialog } from "../../general/ErrorDialog";
import Checklist from "../../formUtil/Checklist";
import { fetch, webApi } from "../../../util/services";
import ImagePicker from "../../formUtil/ImagePicker";

export default function AlbumDialog({ hideDialog, data }) {
  const { handleSubmit, ...rest } = useForm({
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      genre:
        data?.genre && VALID_GENRES.includes(data.genre)
          ? data.genre
          : VALID_GENRES[0],
      sub_level:
        data?.sub_level &&
        VALID_SUB_LEVELS.map((lvl) => lvl.value).includes(data.sub_level)
          ? data.sub_level
          : VALID_SUB_LEVELS[0].value,
      songs: data?.songs?.map((song) => song.id) ?? null,
    },
    mode: "onChange",
  });
  const [status, setStatus] = React.useState({ error: null, loading: true });
  const [validSongs, setValidSongs] = React.useState([]);

  useEffect(() => {
    getMySongs(hideDialog, setStatus, setValidSongs, data);
  }, []);

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
      <Dialog.Title>{data?.id ? "Edit" : "Add"} Album</Dialog.Title>
      <Dialog.ScrollArea>
        <ScrollView style={{ marginVertical: 5 }}>
          <FormDefinition
            {...rest}
            creating={!data?.id}
            validSongs={validSongs}
            initialImageUri={data?.cover}
          ></FormDefinition>
        </ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <View style={styles.row}>
          <Button onPress={hideDialog}>Cancel</Button>
          <Button
            onPress={() =>
              sendRequest(
                async () => await deleteAlbum(data?.id),
                "Song deleted"
              )
            }
          >
            Delete
          </Button>
          <Button
            onPress={handleSubmit((formData) =>
              sendRequest(
                async () => await saveAlbum(data?.id, formData),
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

async function getMySongs(hideDialog, setStatus, setValidSongs, album) {
  try {
    let songs = await fetch(webApi + "/songs/my_songs/", {
      method: "GET",
    });
    songs = await songs.json();
    songs = songs.filter(
      (song) => !song.album_info || (album && song.album_info?.id == album.id)
    );
    songs = songs.map(({ name, artists, id }) => ({
      title: name,
      description: artists.map((artist) => artist.name).join(", "),
      id,
    }));
    if (songs.length == 0) {
      setStatus({ error: "You have no songs to add to an album" });
    } else {
      setValidSongs(songs);
      setStatus({ loading: false });
    }
  } catch (e) {
    hideDialog();
    console.error(e);
    toast.show("Could not get songs to edit album", {
      duration: 3000,
    });
  }
}

function FormDefinition({ creating, validSongs, initialImageUri, ...rest }) {
  return (
    <FormBuilder
      {...rest}
      formConfigArray={[
        {
          type: "custom",
          name: "cover",
          JSX: ImagePicker,
          customProps: {
            shape: "square",
            icon: "album",
            size: 200,
            initialImageUri,
            style: { alignSelf: "center" },
          },
        },
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
          type: "select",
          name: "genre",
          rules: {
            required: {
              value: creating,
              message: "Genre is required",
            },
          },
          textInputProps: {
            mode: "flat",
            label: "Album genre",
            style: styles.textInput,
          },
          options: VALID_GENRES.map((genre) => ({
            value: genre,
            label: genre,
          })),
        },
        {
          type: "select",
          name: "sub_level",
          rules: {
            required: {
              value: creating,
              message: "Subscription level is required",
            },
          },
          textInputProps: {
            mode: "flat",
            label: "Subscription level",
            style: styles.textInput,
          },
          options: VALID_SUB_LEVELS,
        },
        {
          name: "songs",
          type: "custom",
          JSX: Checklist,
          rules: {
            required: {
              value: creating,
              message: "At least one song is required",
            },
          },
          customProps: {
            formProp: "id",
            allOptions: validSongs,
            title: <Title>Songs</Title>,
          },
        },
      ]}
    />
  );
}

AlbumDialog.propTypes = {
  hideDialog: PropTypes.func,
  data: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    description: PropTypes.string,
    genre: PropTypes.string,
    cover: PropTypes.string,
    sub_level: PropTypes.number,
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
  validSongs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  initialImageUri: PropTypes.string,
};
