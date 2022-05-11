import React from "react";
import { List, ActivityIndicator, Subheading, Text } from "react-native-paper";
import { View } from "react-native";
import styles from "../styles.js";
import PropTypes from "prop-types";

// onPress es una funcion que recibe la data de un elemento del response y se ejecuta cuando tocas una cancion
// propGen es una funcion que recibe la data de un elemento del response y devuelva las props del item de la lista
export default function FetchedList({
  response,
  onPress,
  propGen,
  ...viewProps
}) {
  if (!response.data && response.isValidating)
    return <ActivityIndicator style={styles.activityIndicator} />;

  if (response.error) return <ErrorMessage error={response.error} />;

  return <View {...viewProps}>{mapData(response.data, onPress, propGen)}</View>;
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
};

ErrorMessage.propTypes = {
  error: PropTypes.any,
};
