import { useState, useCallback } from "react";
import { Portal } from "react-native-paper";
import AlbumItem from "./AlbumItem";
import AlbumInfo from "./AlbumInfo";
import { ALBUMS_URL } from "../../util/services";
import ContentScreen from "../general/ContentScreen.js";
import LikeIcon from "../general/LikeIcon";

export default function AlbumsScreen() {
  const [modalStatus, setModalStatus] = useState({
    visible: false,
    album: null,
  });

  const onPress = (album) => setModalStatus({ album: album, visible: true });

  const album = useCallback(
    ({ data, onLike, liked }) => (
      <AlbumItem
        onPress={onPress}
        data={data}
        right={(props) => (
          <LikeIcon
            onPress={() => {
              onLike(data?.id);
            }}
            liked={liked}
            {...props}
          />
        )}
      />
    ),
    []
  );

  return (
    <>
      <ContentScreen
        url={ALBUMS_URL}
        withSearchBar={true}
        itemComponent={album}
        type="/albums/"
      />
      <Portal>
        <AlbumInfo modalStatus={modalStatus} setModalStatus={setModalStatus} />
      </Portal>
    </>
  );
}
