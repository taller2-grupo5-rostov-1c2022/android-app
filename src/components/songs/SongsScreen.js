import React from "react";
import { webApi, useSWR, json_fetcher } from "../../util/services";
import { IconButton, Portal, Appbar } from "react-native-paper";
import styles from "../styles.js";
import { View } from "react-native";
import Player from "../Player";
import FetchedList from "../general/FetchedList";
import { PlaylistMenuAdd } from "../general/PlaylistMenuAdd";
import SearchBar from "../general/SearchBar";
import PlayableSongItem from "./PlayableSongItem";

export default function SongsScreen() {
  const [visible, setVisible] = React.useState(false);
  const [songId, setSongId] = React.useState("");
  const [query, setQuery] = React.useState("");
  const songs = useSWR(`${webApi}/songs/songs/${query}`, json_fetcher);

  const song = ({ data }) => (
    <PlayableSongItem
      data={data}
      right={(props) => (
        <IconButton
          {...props}
          onPress={() => {
            setVisible(true), setSongId(data.id);
          }}
          icon="playlist-plus"
        />
      )}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <Appbar>
        <Appbar.Content title="Music" />
      </Appbar>
      <View style={styles.container}>
        <SearchBar setQuery={setQuery} />
        <FetchedList
          response={songs}
          itemComponent={song}
          emptyMessage={query ? "No results" : "There is nothing here..."}
          style={styles.listScreen}
        />
        <Portal>
          <PlaylistMenuAdd
            visible={visible}
            setVisible={setVisible}
            songId={songId}
          ></PlaylistMenuAdd>
        </Portal>
      </View>
      <Player />
    </View>
  );
}
