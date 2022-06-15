import React from "react";
import PropTypes from "prop-types";
import { FormBuilder } from "react-native-paper-form-builder";
import { SongPicker } from "./SongPicker";
import styles from "../../styles";
import Table from "../../formUtil/Table";
import { VALID_GENRES, useSubLevels } from "../../../util/general";
import { inputValidator } from "../../../util/general";

export function defaultGen(data) {
  return {
    name: data?.name ?? "",
    artists: data?.artists?.map((artist) => artist.name) ?? null,
    description: data?.description ?? "",
    genre:
      data?.genre && VALID_GENRES.includes(data.genre)
        ? data.genre
        : VALID_GENRES[0],
    sub_level: data?.sub_level ?? 0,
    file: null,
  };
}

export default function FormDefinition({ data, ...rest }) {
  const subLevels = useSubLevels()?.map(({ level, name }) => ({
    value: level,
    label: name,
  }));

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
            label: "Song name",
            style: styles.textInput,
          },
        },
        {
          type: "custom",
          name: "artists",
          JSX: Table,
          rules: {
            required: {
              value: true,
              message: "At least one author is required",
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
            validate: inputValidator("Description is required"),
          },
          textInputProps: {
            mode: "flat",
            label: "Song description",
            style: styles.textInput,
          },
        },
        {
          type: "select",
          name: "genre",
          rules: {
            required: {
              value: true,
              message: "Genre is required",
            },
          },
          textInputProps: {
            mode: "flat",
            label: "Song genre",
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
          options: subLevels,
        },
        {
          name: "file",
          type: "custom",
          JSX: SongPicker,
          rules: {
            required: {
              value: !data?.id,
              message: "File is required",
            },
          },
        },
      ]}
    />
  );
}

FormDefinition.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
  }),
};
