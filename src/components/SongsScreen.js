import React from "react";
import { webApi, useSWR, json_fetcher } from "../util/services";
import { Headline, List, ActivityIndicator } from "react-native-paper";
import styles from "./styles.js";
import ExternalView from "./ExternalView";
import Player from "./Player";
import appContext from "./appContext";

export default function SongsScreen() {
  const songs = useSWR(webApi + "/songs/", json_fetcher);
  const context = React.useContext(appContext);
  return (
    <ExternalView style={styles.container}>
      <Headline> Songs </Headline>
      {content(
        songs.isValidating,
        songs.data,
        songs.error,
        context.setName,
        context.setArtist
      )}
      <Player />
    </ExternalView>
  );
}

function content(isLoading, data, error, setName, setArtist) {
  if (isLoading) return <ActivityIndicator style={styles.activityIndicator} />;

  if (error) return <Headline>Error: {error.message}</Headline>;

  return mapData(data, setName, setArtist);
}

function mapData(data, setName, setArtist) {
  return data.map((song) => {
    return (
      <List.Item
        title={song.name}
        description={"by " + song.artists}
        key={song.id}
        onPress={() => {
          setName(song.name);
          setArtist(song.artist_name);
        }}
      />
    );
  });
}
