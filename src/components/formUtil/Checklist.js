import React, { useState } from "react";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";
import { Checkbox, HelperText, Title, List, Text } from "react-native-paper";
import { View, TouchableOpacity } from "react-native";
import styles from "../styles";

// Checklist para usar con los forms.
// allOptions es un array con todas las opciones que se pueden seleccionar
// allOptions.out es la propiedad que devuelve el formulario para ese valor
// allOptions.listProps son las props del elemento de la lista
// width es el porcentaje de ancho que ocupa el elemento de la lista
// emptyMessage es el mensaje que se muestra cuando no hay ninguna opción disponible
export default function Checklist(props) {
  const {
    name,
    rules,
    control,
    defaultValue,
    customProps: { allOptions, viewStyle, title, emptyMessage },
  } = props;

  const { field } = useController({
    name,
    rules,
    control,
    defaultValue,
  });
  const err = control.getFieldState(name).error?.message;

  const [values, setValues] = useState(field?.value ?? []);

  const onPress = (value) =>
    setValues((prev) => {
      const newValues = prev ? [...prev] : [];
      if (newValues.includes(value))
        newValues.splice(newValues.indexOf(value), 1);
      else newValues.push(value);

      field.onChange(newValues);
      return newValues;
    });

  const getStatus = (value) => {
    return values && values.includes(value) ? "checked" : "unchecked";
  };

  const options = getOptions(allOptions, onPress, getStatus);
  //if (options.length === 0) return <Text>{emptyMessage}</Text>;

  return (
    <View style={[{ alignSelf: "center", width: "100%" }, viewStyle]}>
      <Title>{title}</Title>
      {options.length > 0 ? options : <Text>{emptyMessage}</Text>}
      {err ? <HelperText type={"error"}>{err}</HelperText> : null}
    </View>
  );
}

function getOptions(allOptions, onPress, getStatus) {
  let i = 0;

  return allOptions.map((option) => (
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
  ));
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
    viewStyle: PropTypes.shape(View.propTypes),
    title: PropTypes.string,
    emptyMessage: PropTypes.string,
  }).isRequired,
};
