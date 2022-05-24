import React, { useEffect } from "react";
import { Dialog, Button, ActivityIndicator } from "react-native-paper";
import { ScrollView, View, Dimensions } from "react-native";
import PropTypes from "prop-types";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import styles from "../../styles";
import { saveAlbum, deleteAlbum } from "../../../util/requests";
import { VALID_GENRES, VALID_SUB_LEVELS } from "../../../util/general";
import { ErrorDialog } from "../../general/ErrorDialog";
import Checklist from "../../formUtil/Checklist";
import { fetch, MY_SONGS_URL } from "../../../util/services";
import ImagePicker from "../../formUtil/ImagePicker";
import { inputValidator } from "../../../util/general";

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
      songs_ids: data?.songs?.map((song) => song.id) ?? [],
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
      await requestSender();

      if (message) globalThis.toast.show(message);
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
                "Album deleted"
              )
            }
          >
            Delete
          </Button>
          <Button
            onPress={handleSubmit((formData) =>
              sendRequest(
                async () => await saveAlbum(data?.id, formData),
                "Album saved"
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
    let songs = await fetch(MY_SONGS_URL, {
      method: "GET",
    });
    songs = songs.filter(
      (song) => !song.album || (album && song.album?.id == album.id)
    );
    songs = songs.map(({ name, id, artists }) => ({
      listProps: {
        title: name,
        description: artists?.map((artist) => artist.name).join(", "),
      },
      out: id,
    }));
    if (songs.length > 0) setValidSongs(songs);
    setStatus({ loading: false });
  } catch (e) {
    hideDialog();
    console.error(e);
    toast.show("Could not get songs to edit album");
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
          rules: {
            required: {
              value: creating,
              message: "Cover is required",
            },
          },
        },
        {
          type: "text",
          name: "name",
          rules: {
            validate: inputValidator("Name is required"),
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
            validate: inputValidator("Description is required"),
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
            validate: inputValidator("Genre is required"),
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
              value: true,
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
          name: "songs_ids",
          type: "custom",
          JSX: Checklist,
          customProps: {
            allOptions: validSongs,
            title: "Songs",
            emptyMessage: "No songs to add",
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
  validSongs: PropTypes.arrayOf(
    PropTypes.shape({
      out: PropTypes.number.isRequired,
      listProps: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired
  ).isRequired,
  initialImageUri: PropTypes.string,
  creating: PropTypes.bool.isRequired,
};
