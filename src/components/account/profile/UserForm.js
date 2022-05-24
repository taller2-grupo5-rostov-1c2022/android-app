import { COUNTRIES, VALID_GENRES } from "../../../util/general.js";
import Checklist from "../../formUtil/Checklist";
import { useForm } from "react-hook-form";
import { FormBuilder } from "react-native-paper-form-builder";
import ImagePicker from "../../formUtil/ImagePicker";
import { Button } from "react-native-paper";
import { View } from "react-native";
import styles from "../../styles.js";
import PropTypes from "prop-types";
import { inputValidator } from "../../../util/general.js";

export function UserForm({ onSubmit, defaultValues, cancelButton }) {
  const { control, setFocus, handleSubmit } = useForm({
    defaultValues: {
      image: null,
      name: defaultValues?.name ?? "",
      preferences: defaultValues?.preferences ?? [],
      location:
        defaultValues?.location && COUNTRIES.includes(defaultValues.location)
          ? defaultValues.location
          : COUNTRIES[0],
    },
    mode: "onChange",
  });

  return (
    <View style={[styles.formWidth, { flex: 1 }]}>
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
              style: { alignSelf: "center" },
            },
          },
          {
            type: "text",
            name: "name",
            textInputProps: {
              mode: "flat",
              label: "User Name",
            },
            rules: {
              validate: inputValidator("Name is required"),
            },
          },
          {
            type: "autocomplete",
            name: "location",
            textInputProps: {
              mode: "flat",
              label: "Location",
            },
            rules: {
              required: true,
              message: "Location is required",
            },
            options: COUNTRIES.map((c) => ({ value: c, label: c })),
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
            },
          },
        ]}
      />
      <View style={[styles.row, { marginTop: 10 }, styles.containerCenter]}>
        {cancelButton}
        <Button
          mode="contained"
          style={[styles.button, { flex: 1 }]}
          onPress={handleSubmit(onSubmit)}
        >
          Submit
        </Button>
      </View>
    </View>
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
