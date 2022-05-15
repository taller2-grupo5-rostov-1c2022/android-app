import React from "react";
import { List, ActivityIndicator, Subheading, Text } from "react-native-paper";
import { ScrollView, View } from "react-native";
import styles from "../styles.js";
import PropTypes from "prop-types";

// onPress es una funcion que recibe la data de un elemento del response y se ejecuta cuando tocas una cancion
// propGen es una funcion que recibe la data de un elemento del response y devuelva las props del item de la lista
// response tiene la respuesta de SWR
// forceLoading (opcional): si es true, entonces se muestra como cargando
// el resto de los props se pasan a la view
export default function FetchedList({
  response,
  onPress,
  propGen,
  forceLoading,
  ...viewProps
}) {
  if ((!response.data && response.isValidating) || forceLoading)
    return <ActivityIndicator style={styles.activityIndicator} />;

  if (response.error) return <ErrorMessage error={response.error} />;

  return (
    <ScrollView {...viewProps}>
      {mapData(response.data, onPress, propGen)}
    </ScrollView>
  );
}

function mapData(data, onPress, propGen) {
  let i = 0;
  return data?.map((element) => {
    return (
      <List.Item
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
};

ErrorMessage.propTypes = {
  error: PropTypes.any,
};
