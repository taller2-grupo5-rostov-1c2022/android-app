import React, { useState } from "react";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";
import { Checkbox, HelperText, List } from "react-native-paper";
import { View } from "react-native";

// Checklist para usar con los forms.
// allOptions es un array con todas las opciones que se pueden seleccionar
// en forma de props de un List.Item.
// formProp es la propiedad que se devuelve en el array de salida
export default function Checklist(props) {
  const {
    name,
    rules,
    control,
    defaultValue,
    customProps: { allOptions, formProp, title, viewProps },
  } = props;

  const { field } = useController({
    name,
    rules,
    control,
    defaultValue,
  });
  const err = control.getFieldState(name).error?.message;

  const [values, setValues] = useState(
    field.value?.length > 0 ? field.value : null
  );

  const onPress = (props) =>
    setValues((prev) => {
      const newValues = [...prev];
      if (newValues.includes(props[formProp]))
        newValues.splice(newValues.indexOf(props[formProp]), 1);
      else newValues.push(props[formProp]);

      if (newValues.length > 0) field.onChange(newValues);
      else field.onChange(null);
      return newValues;
    });

  const getStatus = (props) => {
    return values && values.includes(props[formProp]) ? "checked" : "unchecked";
  };

  let i = 0;
  return (
    <View {...viewProps}>
      {title}
      {allOptions.map((props) => (
        <List.Item
          key={i++}
          {...props}
          left={() => (
            <Checkbox
              status={getStatus(props)}
              onPress={() => onPress(props)}
            />
          )}
        />
      ))}
      {err && <HelperText type={"error"}>{err}</HelperText>}
    </View>
  );
}

Checklist.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.any,
  shouldUnregister: PropTypes.any,
  defaultValue: PropTypes.any,
  control: PropTypes.any,
  customProps: PropTypes.shape({
    allOptions: PropTypes.array.isRequired,
    formProp: PropTypes.string.isRequired,
    viewProps: PropTypes.any,
    title: PropTypes.any,
  }).isRequired,
};
