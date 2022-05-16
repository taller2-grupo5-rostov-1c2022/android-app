import React from "react";
import { webApi, useSWR, json_fetcher } from "../../util/services";
import { Headline, IconButton, Portal } from "react-native-paper";
import styles from "../styles.js";
import { View } from "react-native";
import Player from "../Player";
import FetchedList from "../general/FetchedList";
import { PlaylistMenuAdd } from "../general/PlaylistMenuAdd";
import PlayableSongItem from "./SongItem";
import SearchBar from "../general/SearchBar";

export default function SongsScreen() {
  const [visible, setVisible] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const songs = useSWR(`${webApi}/songs/songs/${query}`, json_fetcher);

  const song = ({ data }) => (
    <PlayableSongItem
      data={data}
      right={() => (
        <IconButton
          onPress={() => setVisible(true)}
          icon="playlist-plus"
          color="black"
          style={{ float: "right" }}
        />
      )}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Headline>Songs</Headline>
        <SearchBar setQuery={setQuery} />
        <FetchedList response={songs} itemComponent={song} />
        <Portal>
          <PlaylistMenuAdd
            visible={visible}
            setVisible={setVisible}
          ></PlaylistMenuAdd>
        </Portal>
      </View>
      <Player />
    </View>
  );
}
