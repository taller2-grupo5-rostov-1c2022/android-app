import React from "react";
import { webApi, useSWR, json_fetcher } from "../util/services";
import { Headline, List, ActivityIndicator } from "react-native-paper";
import styles from "./styles.js";
import ExternalView from "./ExternalView";
import Player from "./Player";


export default function SongsScreen() {
  const songs = useSWR(webApi + "/songs/", json_fetcher);

  return (
    <ExternalView style={styles.container}>
      <Headline> Songs </Headline>
      {content(songs.isValidating, songs.data, songs.error)}
      <Player/>
    </ExternalView>
  );
}

function content(isLoading, data, error) {
  if (isLoading) return <ActivityIndicator style={styles.activityIndicator} />;

  if (error) return <Headline>Error: {error.message}</Headline>;

  return mapData(data);
}

function mapData(data) {
  return Object.entries(data).map(([key, value]) => {
    console.log(key);
    console.log(value);
    return (
      <List.Item
        title={value.name}
        description={"by " + value.artist_name}
        key={key}
      />
    );
  });
}
