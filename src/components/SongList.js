import React from "react";

import { List, ActivityIndicator, Subheading, Text } from "react-native-paper";
import { View } from "react-native";
import styles from "./styles.js";
import PropTypes from "prop-types";

// onPress es una funcion que recibe songs (objeto con key, name, artists) y se ejecuta cuando tocas una cancion
// propGen es una funcion que recibe songs (objeto con key, name, artists) y devuelva las props del item de la lista
export default function SongList({ songs, onPress, propGen, ...viewProps }) {
  if (!songs.data && songs.isValidating)
    return <ActivityIndicator style={styles.activityIndicator} />;

  if (songs.error) return <ErrorMessage error={songs.error} />;

  return <View {...viewProps}>{mapData(songs.data, onPress, propGen)}</View>;
}

function mapData(data, onPress, propGen) {
  return data?.map((song) => {
    return (
      <List.Item
        key={song.id}
        {...propGen(song)}
        onPress={() => onPress(song)}
      />
    );
  });
}

function ErrorMessage({ error }) {
  console.log("Error: ", "\n", error, "\n", { error });
  return (
    <View>
      <Subheading style={styles.errorText}>Error getting songs</Subheading>
      <Text style={styles.errorText}>Error description: {error.message}</Text>
    </View>
  );
}

SongList.propTypes = {
  songs: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired
    ),
    isValidating: PropTypes.bool.isRequired,
    error: PropTypes.any,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  propGen: PropTypes.func.isRequired,
};

ErrorMessage.propTypes = {
  error: PropTypes.any,
};
