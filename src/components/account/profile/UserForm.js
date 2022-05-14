import { VALID_GENRES } from "../../../util/general.js";
import Checklist from "../../formUtil/Checklist";
import { useForm } from "react-hook-form";
import { FormBuilder } from "react-native-paper-form-builder";
import ImagePicker from "../../formUtil/ImagePicker";
import { Button } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import styles from "../../styles.js";
import PropTypes from "prop-types";
import { inputValidator } from "../../../util/general.js";

export function UserForm({ onSubmit, defaultValues, cancelButton }) {
  const { control, setFocus, handleSubmit } = useForm({
    defaultValues: {
      image: null,
      name: defaultValues?.name ?? "",
      location: defaultValues?.location ?? "",
      preferences: defaultValues?.preferences ?? [],
    },
    mode: "onChange",
  });

  return (
    <>
      <FormBuilder
        control={control}
        setFocus={setFocus}
        formConfigArray={[
          {
            name: "image",
            type: "custom",
            JSX: ImagePicker,
            customProps: {
              initialImageUri: defaultValues?.image,
              shape: "circle",
              icon: "account",
              size: 200,
            },
          },
          {
            type: "text",
            name: "name",
            textInputProps: {
              mode: "flat",
              label: "User Name",
              style: styles.formWidth,
            },
            rules: {
              validate: inputValidator("Name is required"),
            },
          },
          {
            type: "text",
            name: "location",
            textInputProps: {
              mode: "flat",
              label: "Location",
              style: styles.formWidth,
            },
            rules: {
              validate: inputValidator("Location is required"),
            },
          },
          {
            name: "preferences",
            type: "custom",
            JSX: Checklist,
            customProps: {
              allOptions: VALID_GENRES.map((name) => ({
                listProps: { title: name },
                out: name,
              })),
              title: "Interests",
              width: StyleSheet.flatten(styles.formWidth).width,
            },
          },
        ]}
      />
      <View style={[styles.row, { marginTop: 10 }, styles.formWidth]}>
        {cancelButton}
        <Button
          mode="contained"
          style={[styles.button, { flex: 1 }]}
          onPress={handleSubmit(onSubmit)}
        >
          Submit
        </Button>
      </View>
    </>
  );
}

UserForm.propTypes = {
  cancelButton: PropTypes.any,
  onSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    location: PropTypes.string,
    preferences: PropTypes.arrayOf(PropTypes.string),
  }),
};
