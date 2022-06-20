import React, { useCallback } from "react";
import { PLAYLISTS_URL } from "../../util/services";
import { Portal, List, IconButton } from "react-native-paper";
import PlaylistMenuPlay from "./PlaylistMenuPlay";
import ContentScreen from "../general/ContentScreen";

export default function PlayListScreen() {
  const [visible, setVisible] = React.useState(false);
  const [playlistId, setPlaylistId] = React.useState("");

  const playlist = useCallback(
    ({ data, onLike, liked }) => (
      <List.Item
        title={data?.name}
        description={data?.description}
        onPress={() => {
          setPlaylistId(data?.id);
          setVisible(true);
        }}
        right={() => (
          <IconButton
            onPress={() => {
              onLike(data?.id);
            }}
            icon={liked ? "heart" : "heart-outline"}
            color={"#808080"}
          />
        )}
      />
    ),
    []
  );

  return (
    <>
      <ContentScreen
        url={PLAYLISTS_URL}
        withSearchBar={false}
        itemComponent={playlist}
        type="/playlists/"
      />
      <Portal>
        <PlaylistMenuPlay
          visible={visible}
          setVisible={setVisible}
          playlistId={playlistId}
        ></PlaylistMenuPlay>
      </Portal>
    </>
  );
}
