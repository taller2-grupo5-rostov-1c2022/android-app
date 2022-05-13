import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";
import { Checkbox, HelperText, Title, List } from "react-native-paper";
import { View, TouchableOpacity } from "react-native";
import styles from "../styles";

// Checklist para usar con los forms.
// allOptions es un array con todas las opciones que se pueden seleccionar
// allOptions.out es la propiedad que devuelve el formulario para ese valor
// allOptions.listProps son las props del elemento de la lista
// alignment es "center" o "left"
export default function Checklist(props) {
  const {
    name,
    rules,
    control,
    defaultValue,
    customProps: { allOptions, width, title },
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

  const onPress = (value) =>
    setValues((prev) => {
      const newValues = prev ? [...prev] : [];
      if (newValues.includes(value))
        newValues.splice(newValues.indexOf(value), 1);
      else newValues.push(value);

      if (newValues.length > 0) field.onChange(newValues);
      else field.onChange(null);
      return newValues;
    });

  const getStatus = (value) => {
    return values && values.includes(value) ? "checked" : "unchecked";
  };

  let i = 0;
  const padding = useMemo(() => getPadding(width), [width]);
  return (
    <View
      style={{ paddingHorizontal: padding, alignSelf: "center", width: "100%" }}
    >
      <Title>{title}</Title>
      {allOptions.map((option) => (
        <TouchableOpacity
          style={styles.row}
          key={i++}
          onPress={() => onPress(option.out)}
        >
          <List.Item
            style={{
              alignSelf: "center",
              width: "100%",
              paddingVertical: 4,
              paddingHorizontal: 0,
            }}
            {...option.listProps}
            left={() => (
              <View style={{ alignSelf: "center" }}>
                <Checkbox status={getStatus(option.out)} />
              </View>
            )}
          />
        </TouchableOpacity>
      ))}
      {err && <HelperText type={"error"}>{err}</HelperText>}
    </View>
  );
}

function getPadding(width) {
  if (!width) return "0%";
  const widthNumber = parseInt(width.replace("%", ""));
  const padding = (100 - widthNumber) / 2;
  return `${padding}%`;
}

Checklist.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.any,
  shouldUnregister: PropTypes.any,
  defaultValue: PropTypes.any,
  control: PropTypes.any,
  customProps: PropTypes.shape({
    allOptions: PropTypes.arrayOf(
      PropTypes.shape({
        out: PropTypes.any.isRequired,
        listProps: PropTypes.any,
      }).isRequired
    ).isRequired,
    width: PropTypes.string.isRequired,
    title: PropTypes.string,
  }).isRequired,
};
