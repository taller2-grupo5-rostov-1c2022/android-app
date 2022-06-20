import React from "react";
import PropTypes from "prop-types";
import { useSWR, json_fetcher, USERS_URL } from "../../util/services";
import { getAuth } from "firebase/auth";
import FetchedList from "../general/FetchedList";
import styles from "../styles.js";
import PlayableSongItem from "../songs/PlayableSongItem";
import { Portal, IconButton, List } from "react-native-paper";
import { useFavorites } from "../../util/requests";
import { View, ScrollView } from "react-native";
import Player from "../Player";
import AlbumItem from "../albums/AlbumItem";
import AlbumInfo from "../albums/AlbumInfo";
import PlaylistMenuPlay from "../playlists/PlaylistMenuPlay";

export default function FavoritesScreen() {
  const uid = getAuth()?.currentUser?.uid;
  const { deleteFavorite } = useFavorites();
  const [visiblePlaylist, setVisiblePlaylist] = React.useState(false);
  const [playlistId, setPlaylistId] = React.useState("");
  const [modalStatus, setModalStatus] = React.useState({
    visible: false,
    album: null,
  });

  const favoritesSongs = useSWR(
    `${USERS_URL}${uid}/favorites/songs/`,
    json_fetcher
  );
  const favoritesAlbums = useSWR(
    `${USERS_URL}${uid}/favorites/albums/`,
    json_fetcher
  );

  const favoritesPlaylists = useSWR(
    `${USERS_URL}${uid}/favorites/playlists/`,
    json_fetcher
  );

  const onDelete = (id, path) => {
    deleteFavorite(uid, id, path);
  };

  const onDeleteSongs = (id) => {
    onDelete(id, "/songs/");
  };

  const onDeleteAlbums = (id) => {
    onDelete(id, "/albums/");
  };

  const onDeletePlaylists = (id) => {
    onDelete(id, "/playlists/");
  };

  const onPressAlbum = (album) =>
    setModalStatus({ album: album, visible: true });

  const onPressPlaylist = (id) => {
    setPlaylistId(id);
    setVisiblePlaylist(true);
  };

  const song = ({ data }) => (
    <PlayableSongItem
      data={data}
      right={(props) => [
        <IconButton
          {...props}
          onPress={() => {
            onDeleteSongs(data?.id);
          }}
          icon={"heart"}
          key={1}
        />,
      ]}
    />
  );

  const album = ({ data }) => (
    <AlbumItem
      onPress={onPressAlbum}
      data={data}
      right={
        <IconButton
          onPress={() => {
            onDeleteAlbums(data?.id);
          }}
          icon="heart"
          color={"#808080"}
        />
      }
    />
  );

  const playlist = ({ data }) => (
    <List.Item
      title={data?.name}
      description={data?.description}
      onPress={() => onPressPlaylist(data.id)}
      right={() => (
        <IconButton
          onPress={() => {
            onDeletePlaylists(data?.id);
          }}
          icon="heart"
          color={"#808080"}
        />
      )}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <List.Section title="Songs" titleStyle={styles.favoritesTitle}>
          <FetchedList
            {...favoritesSongs}
            itemComponent={song}
            emptyMessage={"No Favorites"}
            style={styles.listScreen}
          />
        </List.Section>
        <List.Section title="Albums" titleStyle={styles.favoritesTitle}>
          <FetchedList
            {...favoritesAlbums}
            itemComponent={album}
            emptyMessage={"No Favorites"}
            style={styles.listScreen}
          />
          <Portal>
            <AlbumInfo
              modalStatus={modalStatus}
              setModalStatus={setModalStatus}
            />
          </Portal>
        </List.Section>
        <List.Section title="Playlists" titleStyle={styles.favoritesTitle}>
          <FetchedList
            {...favoritesPlaylists}
            itemComponent={playlist}
            emptyMessage={"No Favorites"}
            style={styles.listScreen}
          />
          <Portal>
            <PlaylistMenuPlay
              visible={visiblePlaylist}
              setVisible={setVisiblePlaylist}
              playlistId={playlistId}
            ></PlaylistMenuPlay>
          </Portal>
        </List.Section>
      </ScrollView>
      <Player />
    </View>
  );
}

FavoritesScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
