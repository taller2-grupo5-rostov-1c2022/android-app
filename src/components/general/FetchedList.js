import React, { useState, memo, useMemo, useCallback } from "react";
import { ActivityIndicator, Subheading, Text } from "react-native-paper";
import { FlatList, View, RefreshControl } from "react-native";
import styles from "../styles.js";
import PropTypes from "prop-types";
import { useTheme } from "react-native-paper";
import { PAGE_SIZE } from "../../util/services";

// itemComponent es el componente para cada item que recibe la prop data de cada item
// data, mutate, isValidating, error, size and setSize son de la respuesta de SWR
// emptyMessage (opcional): mensaje a mostrar si la lista esta vacía
// customData (opcional): una función que recibe la data de la respuesta y devuelve
// la que hay que visualizar
// el resto de los props se pasan a la view
function FetchedList({
  data,
  mutate,
  isValidating,
  error,
  size,
  setSize,
  itemComponent,
  emptyMessage,
  customData,
  ...listProps
}) {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const listData = useMemo(() => {
    let list = size !== undefined ? data?.flat() : data;
    if (customData) list = customData(list);
    return list;
  }, [data, customData]);

  const renderItem = useCallback(
    ({ item, index }) => {
      const Item = itemComponent;
      return (
        <Item data={item} key={listProps.keyExtractor ? undefined : index} />
      );
    },
    [itemComponent, listProps.keyExtractor]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await mutate();
    setRefreshing(false);
  }, [mutate]);

  if (!listData && isValidating)
    return <ActivityIndicator style={styles.activityIndicator} />;

  if (error) return <ErrorMessage error={error} />;

  return (
    <FlatList
      renderItem={renderItem}
      data={listData ?? []}
      refreshControl={
        mutate ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.surface}
          />
        ) : undefined
      }
      onEndReached={
        size &&
        data?.length == size &&
        data[data.length - 1].length == PAGE_SIZE
          ? () => setSize((prev) => prev + 1)
          : undefined
      }
      onEndReachedThreshold={0.2}
      indicatorStyle="white"
      ListEmptyComponent={
        <Subheading
          style={[styles.infoText, { color: theme.colors.info, width: "100%" }]}
        >
          {emptyMessage}
        </Subheading>
      }
      ListFooterComponent={
        size && data[data.length - 1].length == PAGE_SIZE ? (
          <ActivityIndicator />
        ) : undefined
      }
      {...listProps}
    />
  );
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

export default memo(FetchedList);

FetchedList.propTypes = {
  data: PropTypes.array,
  isValidating: PropTypes.bool,
  error: PropTypes.any,
  mutate: PropTypes.func,
  size: PropTypes.number,
  setSize: PropTypes.func,
  itemComponent: PropTypes.any.isRequired,
  emptyMessage: PropTypes.string,
  customData: PropTypes.func,
  ...FlatList.propTypes,
};

ErrorMessage.propTypes = {
  error: PropTypes.any,
};
