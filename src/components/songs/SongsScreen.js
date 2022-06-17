import React, { useState } from "react";
import { View } from "react-native";
import { IconButton, Portal } from "react-native-paper";
import { getAuth } from "firebase/auth";
import {
  useSWRInfinite,
  useSWR,
  json_fetcher,
  SONGS_URL,
  USERS_URL,
} from "../../util/services";
import styles from "../styles.js";
import Player from "../Player";
import FetchedList from "../general/FetchedList";
import { PlaylistMenuAdd } from "../playlists/PlaylistMenuAdd";
import SearchBar from "../general/SearchBar";
import PlayableSongItem from "./PlayableSongItem";
import { useFavorites } from "../../util/requests";
import { PAGE_SIZE } from "../../util/general";

async function fetcher_mock(url) {
  let arr = url.split("|");
  let page = parseInt(arr[1]);
  return (await json_fetcher(arr[0])).slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );
}

export default function SongsScreen() {
  const uid = getAuth()?.currentUser?.uid;
  const [visible, setVisible] = useState(false);
  const [songId, setSongId] = useState("");
  const [query, setQuery] = useState("");
  const { saveFavorite, deleteFavorite } = useFavorites();
  const songs = useSWRInfinite(
    (index) => `${SONGS_URL}${query}|${index}`,
    fetcher_mock
  );
  const { data: favorites } = useSWR(
    `${USERS_URL}${uid}/favorites/songs/`,
    json_fetcher
  );

  const customData = (data) => {
    let favoritesFilted = favorites;
    if (query) {
      const songsIds = getFavoritesIds(data);
      favoritesFilted = favorites.filter((song) => songsIds?.includes(song.id));
    }
    return favoritesFilted?.concat(
      data?.filter(
        (song) => !getFavoritesIds(favoritesFilted)?.includes(song?.id)
      )
    );
  };

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
          response={songs}
          itemComponent={song}
          emptyMessage={query ? "No results" : "There is nothing here..."}
          style={styles.listScreen}
          customData={customData}
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
