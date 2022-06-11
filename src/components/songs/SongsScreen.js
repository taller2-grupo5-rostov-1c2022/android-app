import React from "react";
import { useSWR, json_fetcher, SONGS_URL, USERS_URL } from "../../util/services";
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
  const [visible, setVisible] = React.useState(false);
  const [songId, setSongId] = React.useState("");
  const [query, setQuery] = React.useState("");
  const { saveFavorite, deleteFavorite } = useFavorites();
  const songs = useSWR(`${SONGS_URL}${query}`, json_fetcher);
  const {
    data: favorites,
    error,
    isValidating,
  } = useSWR(`${USERS_URL}${uid}/favorites/songs/`, json_fetcher);
  const favoritesId = favorites?.map(function(favorite) {return favorite.id;});
  
  
  const getSongs2 = () => {
    const sortedSongs = favorites?.concat(songs?.data?.filter(song => !favoritesId?.includes(song?.id)))
    return {
      data: sortedSongs,
      error: songs?.error,
      isValidating: songs?.isValidating
    }
  }
  const songs2 = getSongs2();
  const onLike = (id) => {
    if (favoritesId.includes(id)) {
      deleteFavorite(uid, id, "/songs/");
    } else {
      saveFavorite(uid, id, "/songs/");
    }
  };

  const song = ({ data }) => (
    <PlayableSongItem
      data={data}
      right={(props) => ([
        <IconButton
          {...props}
          onPress={() => {
            onLike(data?.id);
          }}
          icon= {favoritesId?.includes(data?.id) ? "heart" : "heart-outline"}
          key={1}
        />,
        <IconButton
          {...props}
          onPress={() => {
            setVisible(true), setSongId(data.id);
          }}
          icon="playlist-plus"
          key={2}
        />
        ])}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <SearchBar setQuery={setQuery} />
        <FetchedList
          response={songs2}
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
