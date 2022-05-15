import React from "react";
import { webApi, useSWR, json_fetcher } from "../../util/services";
import { Headline, IconButton, Portal } from "react-native-paper";
import styles from "../styles.js";
import { View } from "react-native";
import Player from "../Player";
import FetchedList from "../general/FetchedList";
import { PlaylistMenuAdd } from "../general/PlaylistMenuAdd";
import SongItem from "./SongItem";

export default function SongsScreen() {
  const songs = useSWR(webApi + "/songs/songs/", json_fetcher);
  const [visible, setVisible] = React.useState(false);

  const song = ({ data }) => (
    <SongItem
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
