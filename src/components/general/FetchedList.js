import React, { useState, useEffect } from "react";
import { ActivityIndicator, Subheading, Text } from "react-native-paper";
import { ScrollView, View, RefreshControl } from "react-native";
import styles from "../styles.js";
import PropTypes from "prop-types";
import { useTheme } from "react-native-paper";

// itemComponent es el componente para cada item que recibe la prop data de cada item
// response tiene la respuesta de SWR
// emptyMessage (opcional): mensaje a mostrar si la lista esta vacía
// el resto de los props se pasan a la view
export default function FetchedList({
  response,
  itemComponent,
  emptyMessage,
  scrollRef,
  ...viewProps
}) {
  let theme = useTheme();
  let [refreshing, setRefreshing] = useState(false);
  let [content, setContent] = useState(null);

  useEffect(() => {
    if (!response.data) return;
    if (response.data.length === 0)
      setContent(
        <Subheading style={[styles.infoText, { color: theme.colors.info }]}>
          {emptyMessage}
        </Subheading>
      );
    else setContent(mapData(response.data, itemComponent));
  }, [response.data]);

  const onRefresh = async () => {
    setRefreshing(true);
    await response.mutate();
    setRefreshing(false);
  };

  if (!response.data && response.isValidating)
    return <ActivityIndicator style={styles.activityIndicator} />;

  if (response.error) return <ErrorMessage error={response.error} />;

  return (
    <ScrollView
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
      ref={scrollRef}
      {...viewProps}
    >
      {content}
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
  let theme = useTheme();

  return (
    <View style={[styles.container, styles.containerCenter]}>
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
  scrollRef: PropTypes.any,
  ...ScrollView.propTypes,
};

ErrorMessage.propTypes = {
  error: PropTypes.any,
};
