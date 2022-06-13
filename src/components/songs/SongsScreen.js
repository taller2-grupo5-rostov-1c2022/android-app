import React, { useState, useEffect } from "react";
import {
  useSWR,
  json_fetcher,
  SONGS_URL,
  USERS_URL,
} from "../../util/services";
import { IconButton, Portal } from "react-native-paper";
import styles from "../styles.js";
import { View } from "react-native";
import Player from "../Player";
import FetchedList from "../general/FetchedList";
import { PlaylistMenuAdd } from "../playlists/PlaylistMenuAdd";
import SearchBar from "../general/SearchBar";
import PlayableSongItem from "./PlayableSongItem";
import { getAuth } from "firebase/auth";
import { useFavorites } from "../../util/requests";

export default function SongsScreen() {
  const uid = getAuth()?.currentUser?.uid;
  const [visible, setVisible] = useState(false);
  const [songId, setSongId] = useState("");
  const [query, setQuery] = useState("");
  const { saveFavorite, deleteFavorite } = useFavorites();
  const songs = useSWR(`${SONGS_URL}${query}`, json_fetcher);
  const [songList, setSongList] = useState([]);
  const { data: favorites } = useSWR(
    `${USERS_URL}${uid}/favorites/songs/`,
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

  const onLike = (id) => {
    if (getFavoritesIds(favorites)?.includes(id)) {
      deleteFavorite(uid, id, "/songs/");
    } else {
      saveFavorite(uid, id, "/songs/");
    }
  };

  const song = ({ data }) => (
    <PlayableSongItem
      data={data}
      right={(props) => [
        <IconButton
          {...props}
          onPress={() => {
            onLike(data?.id);
          }}
          icon={
            getFavoritesIds(favorites)?.includes(data?.id)
              ? "heart"
              : "heart-outline"
          }
          key={1}
        />,
        <IconButton
          {...props}
          onPress={() => {
            setVisible(true), setSongId(data.id);
          }}
          icon="playlist-plus"
          key={2}
        />,
      ]}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <SearchBar setQuery={setQuery} />
        <FetchedList
          response={{ ...songs, data: songList }}
          itemComponent={song}
          emptyMessage={query ? "No results" : "There is nothing here..."}
          style={styles.listScreen}
        />
        <Portal>
          <PlaylistMenuAdd
            visible={visible}
            setVisible={setVisible}
            songId={songId}
          ></PlaylistMenuAdd>
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
