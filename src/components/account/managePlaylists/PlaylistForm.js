import React from "react";
import Checklist from "../../formUtil/Checklist";
import { getAuth } from "firebase/auth";
import { PLAYLISTS_URL } from "../../../util/services";
import PropTypes from "prop-types";
import { FormBuilder } from "react-native-paper-form-builder";
import styles from "../../styles";
import { inputValidator } from "../../../util/general";
import { fetch } from "../../../util/services";

export async function defaultGen(data) {
  const playlist = data?.id
    ? await fetch(PLAYLISTS_URL + data?.id, { method: "GET" })
    : null;
  const songs_ids = playlist?.songs?.map((song) => song.id) ?? [];
  const colabs_ids = playlist?.colabs?.map(({ id }) => id) ?? [];
  return {
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      songs_ids,
      colabs_ids,
    },
    extra: getMySongs(playlist),
  };
}

function getMySongs(playlist) {
  const validSongs = playlist?.songs?.map(({ name, id, artists }) => ({
    listProps: {
      title: name,
      description: artists?.map((artist) => artist.name).join(", "),
    },
    out: id,
  }));

  const validColabs = playlist?.colabs?.map(({ name, id }) => ({
    listProps: {
      title: name,
      description: "",
    },
    out: id,
  }));

  return {
    validSongs,
    validColabs,
  };
}

export default function FormDefinition({ data, extra, formState, ...rest }) {
  const isCreator = data?.creator_id === getAuth()?.currentUser?.uid;
  const creating = !data?.id;

  const formConfigArray = [
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
    !creating && {
      name: "songs_ids",
      type: "custom",
      JSX: Checklist,
      customProps: {
        allOptions: extra?.validSongs ?? [],
        title: "Songs",
        emptyMessage: "No songs",
        error: formState?.errors?.songs_ids,
      },
    },
    !creating &&
      isCreator && {
        name: "colabs_ids",
        type: "custom",
        JSX: Checklist,
        customProps: {
          allOptions: extra?.validColabs ?? [],
          title: "Collaborators",
          emptyMessage: "No collabs",
          error: formState?.errors?.colabs_ids,
        },
      },
  ].filter((item) => item);
  return <FormBuilder {...rest} formConfigArray={formConfigArray} />;
}

FormDefinition.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    creator_id: PropTypes.string,
    artists: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ),
    colabs: PropTypes.arrayOf(
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
  extra: PropTypes.shape({
    validSongs: PropTypes.array,
    validColabs: PropTypes.array,
  }),
  formState: PropTypes.any,
};
