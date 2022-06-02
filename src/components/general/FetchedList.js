import React, { useState, useRef, useEffect } from "react";
import { ActivityIndicator, Subheading, Text } from "react-native-paper";
import { ScrollView, View, RefreshControl } from "react-native";
import styles from "../styles.js";
import PropTypes from "prop-types";
import { useTheme } from "react-native-paper";

// itemComponent es el componente para cada item que recibe la prop data de cada item
// response tiene la respuesta de SWR
// forceLoading (opcional): si es true, entonces se muestra como cargando
// emptyMessage (opcional): mensaje a mostrar si la lista esta vacía
// el resto de los props se pasan a la view
export default function FetchedList({
  response,
  itemComponent,
  forceLoading,
  emptyMessage,
  scrollToBottom,
  ...viewProps
}) {
  let theme = useTheme();
  let [refreshing, setRefreshing] = useState(false);
  let [content, setContent] = useState(null);
  let ref = useRef();

  useEffect(() => {
    if (!response.data) return;
    setContent(mapData(response.data, itemComponent));
  }, [response.data]);

  if ((!response.data && response.isValidating) || forceLoading)
    return <ActivityIndicator style={styles.activityIndicator} />;

  if (response.error) return <ErrorMessage error={response.error} />;

  if (
    (response.data && response.data.length == 0) ||
    (!response.data && !response.isValidating)
  ) {
    return (
      <Subheading style={[styles.infoText, { color: theme.colors.info }]}>
        {emptyMessage}
      </Subheading>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await response.mutate();
    setRefreshing(false);
  };

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
      ref={ref}
      onContentSizeChange={
        scrollToBottom
          ? () => {
              ref?.current?.scrollToEnd({ animated: false });
            }
          : undefined
      }
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

  console.log("Error: ", "\n", error, "\n", { error });
  return (
    <View>
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
  forceLoading: PropTypes.bool,
  itemComponent: PropTypes.any.isRequired,
  emptyMessage: PropTypes.string,
  scrollToBottom: PropTypes.bool,
  ...ScrollView.propTypes,
};

ErrorMessage.propTypes = {
  error: PropTypes.any,
};
