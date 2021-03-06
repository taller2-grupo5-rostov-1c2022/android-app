import React, { useState, useCallback } from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { SONGS_URL } from "../../util/services";
import { PlaylistMenuAdd } from "../playlists/PlaylistMenuAdd";
import PlayableSongItem from "./PlayableSongItem";
import ContentScreen from "../general/ContentScreen.js";
import LikeIcon from "../general/LikeIcon";
import Portal from "../general/NavigationAwarePortal";

export default function SongsScreen() {
  const [visible, setVisible] = useState(false);
  const [songId, setSongId] = useState("");

  const onPress = useCallback((data) => {
    setSongId(data?.id);
    setVisible(true);
  }, []);

  const song = useCallback(
    ({ data, onLike, liked }) => (
      <PlayableSongItem
        data={data}
        right={(props) => [
          <LikeIcon
            {...props}
            onPress={() => onLike(data?.id)}
            liked={liked}
            key={1}
          />,
          <IconButton
            {...props}
            onPress={() => onPress(data)}
            icon="playlist-plus"
            key={2}
          />,
        ]}
      />
    ),
    [onPress]
  );

  return (
    <View style={{ flex: 1 }}>
      <ContentScreen
        url={SONGS_URL}
        withSearchBar={true}
        type="/songs/"
        itemComponent={song}
      />
      <Portal>
        <PlaylistMenuAdd
          visible={visible}
          setVisible={setVisible}
          songId={songId}
        />
      </Portal>
    </View>
  );
}
