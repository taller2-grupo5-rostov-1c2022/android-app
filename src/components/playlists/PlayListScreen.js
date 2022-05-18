import React from "react";
import { webApi, useSWR, json_fetcher } from "../../util/services";
import { Appbar, Portal, List } from "react-native-paper";
import styles from "../styles.js";
import { View } from "react-native";
import Player from "../Player";
import FetchedList from "../general/FetchedList";
import PlaylistMenuPlay from "./PlaylistMenuPlay";

export default function PlayListScreen() {
  const [visible, setVisible] = React.useState(false);
  const [playlistId, setPlaylistId] = React.useState("");
  const playlists = useSWR(webApi + "/songs/playlists/", json_fetcher);

  const onPress = (id) => {
    console.log(id);
    setPlaylistId(id);
    setVisible(true);
  };

  const playlist = ({ data }) => (
    <List.Item
      title={data.name}
      description={data.description}
      onPress={() => onPress(data.id)}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <Appbar>
        <Appbar.Content title="Playlists" />
      </Appbar>
      <View style={styles.container}>
        <FetchedList
          response={playlists}
          itemComponent={playlist}
          emptyMessage={"There is nothing here..."}
          style={styles.listScreen}
        />
        <Portal>
          <PlaylistMenuPlay
            visible={visible}
            setVisible={setVisible}
            playlistId={playlistId}
          ></PlaylistMenuPlay>
        </Portal>
      </View>
      <Player />
    </View>
  );
}
