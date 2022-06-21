import React from "react";
import Checklist from "../../formUtil/Checklist";
import { getAuth } from "firebase/auth";

import PropTypes from "prop-types";
import { FormBuilder } from "react-native-paper-form-builder";
import styles from "../../styles";
import { inputValidator } from "../../../util/general";

export function defaultGen(data) {
  const songs_ids = data?.songs?.map((song) => song.id) ?? [];
  const colabs_ids = data?.colabs?.map(({ id }) => id) ?? [];
  return {
    name: data?.name ?? "",
    description: data?.description ?? "",
    songs_ids,
    colabs_ids,
  };
}

export default function FormDefinition({ data, ...rest }) {
  const isCreator = data?.creator_id === getAuth()?.currentUser?.uid;
  const creating = !data?.id;

  const validSongs =
    data?.songs?.map(({ name, id, artists }) => ({
      listProps: {
        title: name,
        description: artists?.map((artist) => artist.name).join(", "),
      },
      out: id,
    })) ?? [];

  const validColabs =
    data?.colabs?.map(({ name, id }) => ({
      listProps: {
        title: name,
        description: "",
      },
      out: id,
    })) ?? [];

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
        allOptions: validSongs,
        title: "Songs",
        emptyMessage: "No songs",
      },
    },
    !creating &&
      isCreator && {
        name: "colabs_ids",
        type: "custom",
        JSX: Checklist,
        customProps: {
          allOptions: validColabs,
          title: "Colaborators",
          emptyMessage: "No colabs",
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
};
