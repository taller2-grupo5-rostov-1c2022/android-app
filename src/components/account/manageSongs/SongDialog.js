import React from "react";
import { Dialog, Button, ActivityIndicator } from "react-native-paper";
import { ScrollView, View, Dimensions } from "react-native";
import PropTypes from "prop-types";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm } from "react-hook-form";
import { SongPicker } from "./SongPicker";
import styles from "../../styles";
import { saveSong, deleteSong } from "../../../util/requests";
import { ErrorDialog } from "../../general/ErrorDialog";
import Table from "../../formUtil/Table";
import { VALID_GENRES, VALID_SUB_LEVELS } from "../../../util/general";
import { inputValidator } from "../../../util/general";

export default function SongDialog({ hideDialog, data, ...restProps }) {
  const { handleSubmit, ...rest } = useForm({
    defaultValues: {
      name: data?.name ?? "",
      artists: data?.artists?.map((artist) => artist.name) ?? null,
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
      file: null,
    },
    mode: "onChange",
  });
  const [status, setStatus] = React.useState({ error: null, loading: false });

  if (status.error)
    return (
      <ErrorDialog
        error={status.error}
        hideDialog={hideDialog}
        {...restProps}
      />
    );

  if (status.loading && restProps?.visible != false)
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
      onDismiss={hideDialog}
      style={{ maxHeight: Dimensions.get("window").height * 0.8 }}
      {...restProps}
    >
      <Dialog.Title>{data?.id ? "Edit" : "Add"} Song</Dialog.Title>
      <Dialog.ScrollArea>
        <ScrollView style={{ marginVertical: 5 }}>
          <FormDefinition {...rest} creating={!data?.id}></FormDefinition>
        </ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <View style={styles.row}>
          <Button onPress={hideDialog}>Cancel</Button>
          <Button
            onPress={() =>
              sendRequest(
                async () => await deleteSong(data?.id),
                "Song deleted"
              )
            }
          >
            Delete
          </Button>
          <Button
            onPress={handleSubmit((formData) =>
              sendRequest(
                async () => await saveSong(data?.id, formData),
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
          options: VALID_SUB_LEVELS,
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

SongDialog.propTypes = {
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
    genre: PropTypes.string,
    sub_level: PropTypes.number,
  }),
};

FormDefinition.propTypes = {
  creating: PropTypes.bool,
};
