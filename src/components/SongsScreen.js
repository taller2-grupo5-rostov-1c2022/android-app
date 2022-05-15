import React from "react";
import { webApi, useSWR, json_fetcher, fetch } from "../util/services";
import { Headline, IconButton, Portal } from "react-native-paper";
import styles from "./styles.js";
import { View } from "react-native";
import Player from "./Player";
import AppContext from "./AppContext";
import FetchedList from "./general/FetchedList";
import { PlaylistMenuAdd } from "./general/PlaylistMenuAdd";
import { getArtistsAsString } from "../util/general";

export default function SongsScreen() {
  const songs = useSWR(webApi + "/songs/songs/", json_fetcher);
  const context = React.useContext(AppContext);
  const [visible, setVisible] = React.useState(false);

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
      description: getArtistsAsString(song.artists),
      right: () => (
        <IconButton
          onPress={() => setVisible(true)}
          icon="playlist-plus"
          color="black"
          style={{ float: "right" }}
        />
      ),
    };
  };

  return (
    <Portal.Host>
      <View style={styles.container}>
        <Headline>Songs</Headline>
        <FetchedList response={songs} onPress={onPress} propGen={propGen} />
        <Portal>
          <PlaylistMenuAdd
            visible={visible}
            setVisible={setVisible}
          ></PlaylistMenuAdd>
          <Player />
        </Portal>
      </View>
    </Portal.Host>
  );
}
