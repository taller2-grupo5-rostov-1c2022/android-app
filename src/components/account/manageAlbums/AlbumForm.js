import React from "react";
import PropTypes from "prop-types";
import { FormBuilder } from "react-native-paper-form-builder";
import styles from "../../styles";
import { VALID_GENRES } from "../../../util/general";
import Checklist from "../../formUtil/Checklist";
import { fetch, MY_SONGS_URL, ALBUMS_URL } from "../../../util/services";
import ImagePicker from "../../formUtil/ImagePicker";
import { inputValidator } from "../../../util/general";

export async function defaultGen(data) {
  const album = data?.id
    ? await fetch(ALBUMS_URL + data?.id, { method: "GET" })
    : null;
  return {
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      genre:
        data?.genre && VALID_GENRES.includes(data.genre)
          ? data.genre
          : VALID_GENRES[0],
      songs_ids: album?.songs?.map((song) => song.id) ?? [],
    },
    extra: await getMySongs(album || data),
  };
}

async function getMySongs(album) {
  try {
    let { items: songs } = await fetch(MY_SONGS_URL, {
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
    return { validSongs: songs, initialImageUri: album?.cover };
  } catch (e) {
    console.error(e);
    throw new Error("Could not get available songs list");
  }
}

export default function FormDefinition({ data, extra, formState, ...rest }) {
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
            initialImageUri: extra?.initialImageUri,
            style: { alignSelf: "center" },
            error: formState.errors.cover,
          },
          rules: {
            required: {
              value: !data?.id,
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
            error: formState.errors.genre,
          },
          options: VALID_GENRES.map((genre) => ({
            value: genre,
            label: genre,
          })),
        },
        {
          name: "songs_ids",
          type: "custom",
          JSX: Checklist,
          customProps: {
            allOptions: extra?.validSongs ?? [],
            title: "Songs",
            emptyMessage: "No songs to add",
            error: formState.errors.songs_ids,
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
    id: PropTypes.number,
  }),
  formState: PropTypes.any,
};
