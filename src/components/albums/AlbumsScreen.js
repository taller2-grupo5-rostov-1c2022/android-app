import React, { useState } from "react";
import { webApi, useSWR, json_fetcher } from "../../util/services";
import { Headline, Portal } from "react-native-paper";
import styles from "../styles.js";
import { View } from "react-native";
import Player from "../Player";
import FetchedList from "../general/FetchedList";
import AlbumItem from "./AlbumItem";
import AlbumInfo from "./AlbumInfo";
import SearchBar from "../general/SearchBar";

export default function AlbumsScreen() {
  const [query, setQuery] = React.useState("");
  const songs = useSWR(`${webApi}/songs/albums/${query}`, json_fetcher);
  const [modalStatus, setModalStatus] = useState({
    visible: false,
    album: null,
  });

  const onPress = (album) => setModalStatus({ album: album, visible: true });

  const album = ({ data }) => <AlbumItem onPress={onPress} data={data} />;

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.container]}>
        <Headline>Albums</Headline>
        <SearchBar setQuery={setQuery} />
        <FetchedList response={songs} itemComponent={album} />
        <Portal>
          <AlbumInfo
            modalStatus={modalStatus}
            setModalStatus={setModalStatus}
          />
        </Portal>
      </View>
      <Player />
    </View>
  );
}
