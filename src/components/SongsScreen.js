import React from "react";
import { webApi, useSWR, json_fetcher, fetch } from "../util/services";
import { Headline } from "react-native-paper";
import styles from "./styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import Player from "./Player";
import appContext from "./appContext";
import FetchedList from "./general/FetchedList";
import { Portal } from 'react-native-paper';

export default function SongsScreen() {
  const songs = useSWR(webApi + "/songs/songs/", json_fetcher);
  const context = React.useContext(appContext);

  const onPress = (song) => {
    fetch(webApi + "/songs/songs/" + song.id)
      .then((res) => res.json())
      .then((res) => {
        song.url = res.file;
        context.setSong(song);
      });
  };

  const propGen = (song) => {
    return {
      title: song.name,
      description:
        "by " + song.artists?.map((artist) => artist.name).join(", "),
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <Portal.Host>
      <Headline>Songs</Headline>
      <FetchedList response={songs} onPress={onPress} propGen={propGen} />
      <Player />
      </Portal.Host>
    </SafeAreaView>
  );
}
