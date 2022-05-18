import React from "react";
import { ActivityIndicator, Subheading, Text } from "react-native-paper";
import { ScrollView, View } from "react-native";
import styles from "../styles.js";
import PropTypes from "prop-types";

// itemComponent es el componente para cada item que recibe la prop data de cada item
// response tiene la respuesta de SWR
// forceLoading (opcional): si es true, entonces se muestra como cargando
// el resto de los props se pasan a la view
export default function FetchedList({
  response,
  itemComponent,
  forceLoading,
  ...viewProps
}) {
  if ((!response.data && response.isValidating) || forceLoading)
    return <ActivityIndicator style={styles.activityIndicator} />;

  if (response.error) return <ErrorMessage error={response.error} />;

  return (
    <ScrollView {...viewProps}>
      {response?.data?.length > 0 ? (
        mapData(response.data, itemComponent)
      ) : (
        <Subheading style={styles.infoText}>No results</Subheading>
      )}
    </ScrollView>
  );
}

function mapData(data, itemComponent) {
  let i = 0;
  const Item = itemComponent;
  return data?.map((element) => {
    return <Item key={i++} data={element} />;
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
  forceLoading: PropTypes.bool,
  itemComponent: PropTypes.any.isRequired,
};

ErrorMessage.propTypes = {
  error: PropTypes.any,
};
