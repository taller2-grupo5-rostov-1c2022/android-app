import React, { useState, memo, useMemo, useCallback } from "react";
import { ActivityIndicator, Subheading, Text } from "react-native-paper";
import { FlatList, View, RefreshControl, ScrollView } from "react-native";
import styles from "../styles.js";
import PropTypes from "prop-types";
import { useTheme } from "react-native-paper";

// itemComponent es el componente para cada item que recibe la prop data de cada item
// data, mutate, isValidating, error, size and setSize son de la respuesta de SWR
// emptyMessage (opcional): mensaje a mostrar si la lista esta vacía
// customData (opcional): una función que recibe la data de la respuesta y devuelve
// la que hay que visualizar
// el resto de los props se pasan a la view
function FetchedList({
  data,
  mutate,
  error,
  size,
  setSize,
  itemComponent,
  emptyMessage,
  customData,
  noScroll,
  ...listProps
}) {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const items =
    size !== undefined ? data?.map((i) => i.items).flat() : data?.items ?? data;
  const listData = useMemo(() => {
    return customData ? customData(items) : items;
  }, [data, customData]);

  const Item = getRenderItem(itemComponent, listProps.keyExtractor);
  const renderItem = useCallback(
    ({ item, index }) => {
      return <Item item={item} index={index} />;
    },
    [itemComponent, listProps.keyExtractor]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await mutate();
    setRefreshing(false);
  }, [mutate]);

  if (!listData) return <ActivityIndicator style={styles.activityIndicator} />;

  if (error) return <ErrorMessage error={error} />;

  const content = (
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
      ListEmptyComponent={
        <Subheading style={[styles.infoText, { color: theme.colors.info }]}>
          {emptyMessage}
        </Subheading>
      }
      onEndReached={
        size &&
        items &&
        data?.length == size &&
        data[data.length - 1].total != items.length
          ? () => setSize((prev) => prev + 1)
          : undefined
      }
      onEndReachedThreshold={0.005}
      indicatorStyle="white"
      ListFooterComponent={
        size && items && data[data.length - 1].total != items.length ? (
          <ActivityIndicator />
        ) : undefined
      }
      {...listProps}
    />
  );

  if (noScroll)
    return (
      <ScrollView
        horizontal={true}
        style={{ width: "100%", height: "100%", flex: 1 }}
        contentContainerStyle={{ marginBottom: "5%", flex: 1 }}
      >
        {content}
      </ScrollView>
    );

  return content;
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

function getRenderItem(itemComponent, keyExtractor) {
  const Item = ({ item, index }) => {
    const Item = itemComponent;
    return <Item data={item} key={keyExtractor ? keyExtractor(item) : index} />;
  };

  Item.propTypes = {
    item: PropTypes.any.isRequired,
    index: PropTypes.number.isRequired,
  };

  const comparison = (prevProps, nextProps) => {
    if (JSON.stringify(prevProps.item) != JSON.stringify(nextProps.item))
      return false;

    return keyExtractor ? true : prevProps.index === nextProps.index;
  };

  return memo(Item, comparison);
}

const dataPropTypes = PropTypes.shape({
  items: PropTypes.array,
  total: PropTypes.number,
}).isRequired;

FetchedList.propTypes = {
  data: PropTypes.oneOfType([dataPropTypes, PropTypes.arrayOf(dataPropTypes)]),
  isValidating: PropTypes.bool,
  error: PropTypes.any,
  mutate: PropTypes.func,
  size: PropTypes.number,
  setSize: PropTypes.func,
  itemComponent: PropTypes.any.isRequired,
  emptyMessage: PropTypes.string,
  customData: PropTypes.func,
  noScroll: PropTypes.bool,
  ...FlatList.propTypes,
};

ErrorMessage.propTypes = {
  error: PropTypes.any,
};
