import React, { useState } from "react";
import { webApi, useSWR, json_fetcher } from "../../util/services";
import { Headline, Portal } from "react-native-paper";
import styles from "../styles.js";
import { View } from "react-native";
import Player from "../Player";
import FetchedList from "../general/FetchedList";
import { ShapedImage } from "../general/ShapedImage";
import AlbumInfo from "./AlbumInfo";

export default function AlbumsScreen() {
  const songs = useSWR(webApi + "/songs/albums/", json_fetcher);
  const [modalStatus, setModalStatus] = useState({
    visible: false,
    album: null,
  });

  const propGen = (album) => {
    return {
      title: album.name,
      description: album.genre,
      left: () => (
        <ShapedImage
          icon="album"
          size={50}
          shape="square"
          imageUri={album.cover}
          style={{ marginRight: 10 }}
        />
      ),
    };
  };

  const onPress = (album) => setModalStatus({ album: album, visible: true });

  return (
    <Portal.Host>
      <View style={[styles.container, styles.listPlayerPadding]}>
        <Headline>Albums</Headline>
        <FetchedList response={songs} propGen={propGen} onPress={onPress} />
        <Portal>
          <AlbumInfo
            modalStatus={modalStatus}
            setModalStatus={setModalStatus}
          />
          <Player />
        </Portal>
      </View>
    </Portal.Host>
  );
}
