import React from "react";
import { useSWR, json_fetcher, PLAYLISTS_URL, USERS_URL } from "../../util/services";
import { Portal, List, IconButton } from "react-native-paper";
import styles from "../styles.js";
import { View } from "react-native";
import Player from "../Player";
import FetchedList from "../general/FetchedList";
import PlaylistMenuPlay from "./PlaylistMenuPlay";
import { useFavorites } from "../../util/requests";
import { getAuth } from "firebase/auth";

export default function PlayListScreen() {
  const uid = getAuth()?.currentUser?.uid;
  const [visible, setVisible] = React.useState(false);
  const [playlistId, setPlaylistId] = React.useState("");
  const [songList, setSongList] = React.useState([]);
  const { saveFavorite, deleteFavorite } = useFavorites();
  const playlists = useSWR(PLAYLISTS_URL, json_fetcher);
  const { data: favorites } = useSWR(
    `${USERS_URL}${uid}/favorites/playlists/`,
    json_fetcher
  );

  React.useEffect(() => {
    const sortedSongs = favorites?.concat(
      playlists?.data?.filter(
        (song) => !getFavoritesIds(favorites)?.includes(song?.id)
      )
    );
    setSongList(sortedSongs);
  }, [playlists?.data, favorites]);

  const onPress = (id) => {
    setPlaylistId(id);
    setVisible(true);
  };

  const onLike = (id) => {
    console.log(id)
    if (getFavoritesIds(favorites)?.includes(id)) {
      deleteFavorite(uid, id, "/playlists/");
    } else {
      saveFavorite(uid, id, "/playlists/");
    }
  };

  const playlist = ({ data }) => (
    <List.Item
      title={data?.name}
      description={data?.description}
      onPress={() => onPress(data.id)}
      right={() => <IconButton
        onPress={() => {
          onLike(data?.id);
        }}
        icon={
          getFavoritesIds(favorites)?.includes(data?.id)
            ? "heart"
            : "heart-outline"
        }
        color={"#808080"}
      />}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <FetchedList
          response={{ ...playlists, data: songList }}
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

function getFavoritesIds(favorites) {
  return favorites?.map(function (favorite) {
    return favorite.id;
  });
}