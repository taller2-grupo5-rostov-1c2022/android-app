import React from "react";
import { webApi, useSWR, json_fetcher } from "../util/services";
import { Headline, List, ActivityIndicator } from "react-native-paper";
import styles from "./styles.js";
import ExternalView from "./ExternalView";

export default function ManageMySongs() {
  const songs = useSWR(webApi + "/songs/", json_fetcher);

  return (
    <ExternalView style={styles.container}>
      <Headline>Manage My Songs</Headline>
      {content(songs.isValidating, songs.data, songs.error)}
    </ExternalView>
  );
}

function content(isLoading, data, error) {
  if (isLoading) return <ActivityIndicator></ActivityIndicator>;

  if (error) return <Headline>Error: {error.message}</Headline>;

  return mapData(data);
}

function mapData(data) {
  return Object.entries(data).map(([key, value]) => {
    return (
      <List.Item title={value.name} key={key} onPress={onEdit(key, value)} />
    );
  });
}

function onEdit(key, songData) {
  console.log(key);
  console.log(songData);
}
