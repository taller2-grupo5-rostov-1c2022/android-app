import React from "react";
import { List, ActivityIndicator, Subheading, Text } from "react-native-paper";
import { View } from "react-native";
import styles from "../styles.js";
import PropTypes from "prop-types";

// onPress es una funcion que recibe la data de un elemento del response y se ejecuta cuando tocas una cancion
// propGen es una funcion que recibe la data de un elemento del response y devuelva las props del item de la lista
// response tiene la respuesta de SWR
// forceLoading (opcional): si es true, entonces se muestra como cargando
// customComponent (opcional): cambia los list items por este componente
// el resto de los props se pasan a la view
export default function FetchedList({
  response,
  onPress,
  propGen,
  forceLoading,
  customComponent,
  ...viewProps
}) {
  if ((!response.data && response.isValidating) || forceLoading)
    return <ActivityIndicator style={styles.activityIndicator} />;

  if (response.error) return <ErrorMessage error={response.error} />;

  return (
    <View {...viewProps}>
      {mapData(response.data, onPress, propGen, customComponent)}
    </View>
  );
}

function mapData(data, onPress, propGen, customComponent) {
  let i = 0;
  let Component = customComponent ?? List.Item;
  return data?.map((element) => {
    return (
      <Component
        key={i++}
        {...propGen(element)}
        onPress={() => onPress(element)}
      />
    );
  });
}

function ErrorMessage({ error }) {
  console.log("Error: ", "\n", error, "\n", { error });
  return (
    <View>
      <Subheading style={styles.errorText}>
        Error populating the list
      </Subheading>
      <Text style={styles.errorText}>Error description: {error.message}</Text>
    </View>
  );
}

FetchedList.propTypes = {
  response: PropTypes.shape({
    data: PropTypes.array,
    isValidating: PropTypes.bool.isRequired,
    error: PropTypes.any,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  propGen: PropTypes.func.isRequired,
  forceLoading: PropTypes.bool,
  customComponent: PropTypes.any,
};

ErrorMessage.propTypes = {
  error: PropTypes.any,
};
