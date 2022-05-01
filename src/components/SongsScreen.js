import React from "react";
import { webApi, useSWR, json_fetcher } from "../util/services";
import {
  Headline,
  List,
  ActivityIndicator,
  Subheading,
  Text,
} from "react-native-paper";
import { View } from "react-native";
import styles from "./styles.js";
import ExternalView from "./ExternalView";
import Player from "./Player";
import appContext from "./appContext";
import PropTypes from "prop-types";

export default function SongsScreen() {
  const songs = useSWR(webApi + "/songs/", json_fetcher);
  const context = React.useContext(appContext);
  return (
    <ExternalView style={styles.container}>
      <Headline>Songs</Headline>
      {content(songs, context.setName, context.setArtist, context.setSongUrl)}
      <Player />
    </ExternalView>
  );
}

function content(songs, setName, setArtist, setSongUrl) {
  if (!songs.data && songs.isLoading)
    return <ActivityIndicator style={styles.activityIndicator} />;

  if (songs.error) return <ErrorMessage error={songs.error} />;

  return mapData(songs.data, setName, setArtist, setSongUrl);
}

function mapData(data, setName, setArtist, setSongUrl) {
  const onPress = (song) => {
    setName(song.name);
    setArtist(song.artists);
    fetch(webApi + "/songs/" + song.id)
      .then((res) => res.json())
      .then((res) => {
        setSongUrl(res.file);
      });
  };

  return data?.map((song) => {
    return (
      <List.Item
        title={song.name}
        description={"by " + song.artists}
        key={song.id}
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

ErrorMessage.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }).isRequired,
};
