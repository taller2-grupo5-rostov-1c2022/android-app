import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";
import { TextInput, HelperText } from "react-native-paper";

// Table para usar con los forms.
export default function Table(props) {
  const {
    name,
    rules,
    control,
    defaultValue,
    customProps: { textInputProps, addIndex },
  } = props;

  const { field } = useController({
    name,
    rules,
    control,
    defaultValue,
  });
  const err = control.getFieldState(name).error?.message;

  const [values, setValues] = useState(field.value ?? [""]);
  const onAdd = () => setValues((prev) => prev.concat([""]));

  useEffect(() => {
    if (
      field.value?.length == values.length &&
      field.value?.every((_, i) => values[i] == field?.value[i])
    )
      return;
    setValues(field.value ?? [""]);
  }, [field.value]);

  const updateValues = (index, text) =>
    setValues((prev) => {
      const newValues = [...prev];
      newValues[index] = text;
      field.onChange(newValues.filter((v) => v !== ""));
      return newValues;
    });

  const onDelete = (index) =>
    setValues((prev) => {
      const newValues = [...prev];
      newValues.splice(index, 1);
      field.onChange(newValues.filter((v) => v !== ""));
      return newValues;
    });

  const getButton = (index) => {
    if (index != values.length - 1)
      return (
        <TextInput.Icon
          name="delete"
          onPress={() => onDelete(index)}
          forceTextInputFocus={false}
        />
      );

    if (values[index] === "") return null;

    return (
      <TextInput.Icon name="plus" onPress={onAdd} forceTextInputFocus={false} />
    );
  };

  const onBlur = (index) => {
    if (values[index] === "" && index != values.length - 1) onDelete(index);
  };

  const getInputs = () => {
    let inputs = [];
    for (let i = 0; i < values.length; i++) {
      let props = textInputProps;
      if (values.length > 1 && addIndex) {
        let { label, ...rest } = textInputProps;
        props = { label: `${label} ${i + 1}`, ...rest };
      }
      inputs.push(
        <Fragment key={i}>
          <TextInput
            ref={values[i] == "" ? field.ref : undefined}
            error={(field.value || values[i] == "") && err}
            onChangeText={(text) => updateValues(i, text)}
            onBlur={() => onBlur(i)}
            value={values[i]}
            {...props}
            right={getButton(i)}
          />
        </Fragment>
      );
    }
    return inputs;
  };

  return (
    <Fragment>
      {getInputs()}
      {err ? <HelperText type={"error"}>{err}</HelperText> : null}
    </Fragment>
  );
}

Table.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.any,
  shouldUnregister: PropTypes.any,
  defaultValue: PropTypes.any,
  control: PropTypes.any,
  customProps: PropTypes.shape({
    textInputProps: PropTypes.any,
    addIndex: PropTypes.bool,
  }).isRequired,
};
