import React from "react";
import PropTypes from "prop-types";
import { FormBuilder } from "react-native-paper-form-builder";
import styles from "../../styles";
import { VALID_GENRES, VALID_SUB_LEVELS } from "../../../util/general";
import Checklist from "../../formUtil/Checklist";
import { fetch, MY_SONGS_URL } from "../../../util/services";
import ImagePicker from "../../formUtil/ImagePicker";
import { inputValidator } from "../../../util/general";

export function defaultGen(data) {
  return {
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
  };
}

export async function getMySongs(album, setExtra, setStatus) {
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
    if (songs.length > 0)
      setExtra({ validSongs: songs, initialImageUri: album?.cover });
    setStatus((prev) => ({ ...prev, loading: false }));
  } catch (e) {
    console.error(e);
    setStatus({
      error: { message: "Could not get songs to edit album" },
      loading: false,
    });
  }
}

export default function FormDefinition({
  data,
  extra: { validSongs, initialImageUri },
  ...rest
}) {
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
              value: !!data?.id,
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
            allOptions: validSongs ?? [],
            title: "Songs",
            emptyMessage: "No songs to add",
          },
        },
      ]}
    />
  );
}

FormDefinition.propTypes = {
  extra: PropTypes.shape({
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
  }),
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};
