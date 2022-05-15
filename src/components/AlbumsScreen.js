import React from "react";
import { webApi, useSWR, json_fetcher } from "../util/services";
import { Headline, Portal } from "react-native-paper";
import styles from "./styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import Player from "./Player";
import FetchedList from "./general/FetchedList";
import { ShapedImage } from "./general/ShapedImage";

export default function AlbumsScreen() {
  const songs = useSWR(webApi + "/songs/albums/", json_fetcher);

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

  return (
    <SafeAreaView style={styles.container}>
      <Headline>Albums</Headline>
      <FetchedList response={songs} propGen={propGen} onPress={() => null} />
      <Portal>
        <Player />
      </Portal>
    </SafeAreaView>
  );
}
