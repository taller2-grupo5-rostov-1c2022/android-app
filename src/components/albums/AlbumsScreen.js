import { useState, useEffect } from "react";
import {
  ALBUMS_URL,
  USERS_URL,
  useSWR,
  json_fetcher,
} from "../../util/services";
import { Portal, IconButton } from "react-native-paper";
import styles from "../styles.js";
import { View } from "react-native";
import Player from "../Player";
import FetchedList from "../general/FetchedList";
import AlbumItem from "./AlbumItem";
import AlbumInfo from "./AlbumInfo";
import SearchBar from "../general/SearchBar";
import { getAuth } from "firebase/auth";
import { useFavorites } from "../../util/requests";

export default function AlbumsScreen() {
  const uid = getAuth()?.currentUser?.uid;
  const [query, setQuery] = useState("");
  const [songList, setSongList] = useState([]);
  const { saveFavorite, deleteFavorite } = useFavorites();
  const songs = useSWR(`${ALBUMS_URL}${query}`, json_fetcher);
  const [modalStatus, setModalStatus] = useState({
    visible: false,
    album: null,
  });
  const { data: favorites } = useSWR(
    `${USERS_URL}${uid}/favorites/albums/`,
    json_fetcher
  );

  useEffect(() => {
    let favoritesFilted = favorites;
    if (query) {
      const songsIds = getFavoritesIds(songs?.data);
      favoritesFilted = favorites.filter((song) => songsIds?.includes(song.id));
    }
    const sortedSongs = favoritesFilted?.concat(
      songs?.data?.filter(
        (song) => !getFavoritesIds(favoritesFilted)?.includes(song?.id)
      )
    );
    setSongList(sortedSongs);
  }, [songs?.data, favorites]);

  const onPress = (album) => setModalStatus({ album: album, visible: true });

  const onLike = (id) => {
    console.log(id);
    if (getFavoritesIds(favorites)?.includes(id)) {
      deleteFavorite(uid, id, "/albums/");
    } else {
      saveFavorite(uid, id, "/albums/");
    }
  };

  const album = ({ data }) => (
    <AlbumItem
      onPress={onPress}
      data={data}
      right={
        <IconButton
          onPress={() => {
            onLike(data?.id);
          }}
          icon={
            getFavoritesIds(favorites)?.includes(data?.id)
              ? "heart"
              : "heart-outline"
          }
          color={"#808080"}
        />
      }
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.container]}>
        <SearchBar setQuery={setQuery} />
        <FetchedList
          response={{ ...songs, data: songList }}
          itemComponent={album}
          emptyMessage={query ? "No results" : "There is nothing here..."}
          style={styles.listScreen}
        />
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

function getFavoritesIds(favorites) {
  return favorites?.map(function (favorite) {
    return favorite.id;
  });
}
