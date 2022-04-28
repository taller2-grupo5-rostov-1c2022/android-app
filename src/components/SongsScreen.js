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
        context.setArtist,
        context.setSongUrl
      )}
      <Player />
    </ExternalView>
  );
}

function content(isLoading, data, error, setName, setArtist, setSongUrl) {
  if (isLoading) return <ActivityIndicator style={styles.activityIndicator} />;

  if (error) return <Headline>Error: {error.message}</Headline>;

  return mapData(data, setName, setArtist, setSongUrl);
}

function mapData(data, setName, setArtist, setSongUrl) {
  return data.map((song) => {
    return (
      <List.Item
        title={song.name}
        description={"by " + song.artists}
        key={song.id}
        onPress={() => {
          setName(song.name);
          setArtist(song.artist_name);
          fetch(webApi + "/songs/" + song.id)
            .then((res) => res.json())
            .then((res) => {
              setSongUrl(res.file);
              console.log("song url: " + res.file);
            });
        }}
      />
    );
  });
}
