import React, { useEffect, useState } from "react";
import { ActivityIndicator, Subheading, Text } from "react-native-paper";
import { FlatList, View, RefreshControl } from "react-native";
import styles from "../styles.js";
import PropTypes from "prop-types";
import { useTheme } from "react-native-paper";
import { PAGE_SIZE } from "../../util/general";

// itemComponent es el componente para cada item que recibe la prop data de cada item
// response tiene la respuesta de SWR
// emptyMessage (opcional): mensaje a mostrar si la lista esta vacía
// customData (opcional): una función que recibe la data de la respuesta y devuelve
// la que hay que visualizar
// el resto de los props se pasan a la view
export default function FetchedList({
  response,
  itemComponent,
  emptyMessage,
  customData,
  ...listProps
}) {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!response.data) return;
    let data =
      response.size !== undefined ? response.data.flat() : response.data;

    if (customData) data = customData(data);
    setData(data);
  }, [response.data, customData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await response.mutate();
    setRefreshing(false);
  };

  if ((!response.data && response.isValidating) || (response.data && !data))
    return <ActivityIndicator style={styles.activityIndicator} />;

  if (response.error) return <ErrorMessage error={response.error} />;

  if (!response.data || response.data.length === 0)
    return (
      <Subheading style={[styles.infoText, { color: theme.colors.info }]}>
        {emptyMessage}
      </Subheading>
    );

  return (
    <FlatList
      renderItem={(i) => renderItem(itemComponent, i)}
      data={data}
      refreshControl={
        response.mutate ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.surface}
          />
        ) : undefined
      }
      onEndReached={
        response.size &&
        response.data.length == response.size &&
        response.data[response.data.length - 1].length == PAGE_SIZE
          ? () => response.setSize((prev) => prev + 1)
          : undefined
      }
      onEndReachedThreshold={0.2}
      indicatorStyle="white"
      ListFooterComponent={
        response.size &&
        response.data[response.data.length - 1].length == PAGE_SIZE ? (
          <ActivityIndicator />
        ) : undefined
      }
      {...listProps}
    />
  );
}

function renderItem(Item, { item, index }) {
  return <Item data={item} key={index} />;
}

function ErrorMessage({ error }) {
  let theme = useTheme();

  return (
    <View style={styles.container}>
      <Subheading style={{ color: theme.colors.error }}>
        Error populating the list
      </Subheading>
      <Text style={{ color: theme.colors.error }}>
        Error description: {error.message}
      </Text>
    </View>
  );
}

FetchedList.propTypes = {
  response: PropTypes.shape({
    data: PropTypes.array,
    isValidating: PropTypes.bool,
    error: PropTypes.any,
    mutate: PropTypes.func,
  }).isRequired,
  itemComponent: PropTypes.any.isRequired,
  emptyMessage: PropTypes.string,
  customData: PropTypes.func,
  ...FlatList.propTypes,
};

ErrorMessage.propTypes = {
  error: PropTypes.any,
};
