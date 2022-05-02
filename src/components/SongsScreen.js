import React from "react";
import { webApi, useSWR, json_fetcher, fetch } from "../util/services";
import { Headline } from "react-native-paper";
import styles from "./styles.js";
import ExternalView from "./ExternalView";
import Player from "./Player";
import appContext from "./appContext";
import SongList from "./SongList";

export default function SongsScreen() {
  const songs = useSWR(webApi + "/songs/", json_fetcher);
  const context = React.useContext(appContext);

  const onPress = (song) => {
    context.setName(song.name);
    context.setArtist(song.artists);
    fetch(webApi + "/songs/" + song.id)
      .then((res) => res.json())
      .then((res) => {
        context.setSongUrl(res.file);
      });
  };

  const propGen = (song) => {
    return {
      title: song.name,
      description: "by " + song.artists,
    };
  };

  return (
    <ExternalView style={styles.container}>
      <Headline>Songs</Headline>
      <SongList songs={songs} onPress={onPress} propGen={propGen} />
      <Player />
    </ExternalView>
  );
}
