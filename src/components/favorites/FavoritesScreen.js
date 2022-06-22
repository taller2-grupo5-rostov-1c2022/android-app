import React from "react";
import PropTypes from "prop-types";
import FetchedList from "../general/FetchedList";
import styles from "../styles.js";
import PlayableSongItem from "../songs/PlayableSongItem";
import { Portal, List } from "react-native-paper";
import { useFavorites } from "../../util/requests";
import { View, ScrollView } from "react-native";
import Player from "../Player";
import AlbumItem from "../albums/AlbumItem";
import AlbumInfo from "../albums/AlbumInfo";
import PlaylistMenuPlay from "../playlists/PlaylistMenuPlay";
import LikeIcon from "../general/LikeIcon";

export default function FavoritesScreen() {
  const { response: favoritesSongs, deleteFavorite: deleteSong } =
    useFavorites("/songs/");
  const { response: favoritesAlbums, deleteFavorite: deleteAlbum } =
    useFavorites("/albums/");
  const { response: favoritesPlaylists, deleteFavorite: deletePlaylist } =
    useFavorites("/playlists/");
  const [visiblePlaylist, setVisiblePlaylist] = React.useState(false);
  const [playlistId, setPlaylistId] = React.useState("");
  const [modalStatus, setModalStatus] = React.useState({
    visible: false,
    album: null,
  });

  const onPressAlbum = (album) =>
    setModalStatus({ album: album, visible: true });

  const onPressPlaylist = (id) => {
    setPlaylistId(id);
    setVisiblePlaylist(true);
  };

  const song = ({ data }) => (
    <PlayableSongItem
      data={data}
      right={(props) => (
        <LikeIcon
          {...props}
          onPress={() => {
            deleteSong(data);
          }}
          liked={true}
        />
      )}
    />
  );

  const album = ({ data }) => (
    <AlbumItem
      onPress={onPressAlbum}
      data={data}
      right={(props) => (
        <LikeIcon
          {...props}
          onPress={() => {
            deleteAlbum(data);
          }}
          liked={true}
        />
      )}
    />
  );

  const playlist = ({ data }) => (
    <List.Item
      title={data?.name}
      description={data?.description}
      onPress={() => onPressPlaylist(data.id)}
      right={(props) => (
        <LikeIcon
          {...props}
          onPress={() => {
            deletePlaylist(data);
          }}
          liked={true}
        />
      )}
    />
  );

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <List.Section title="Songs" titleStyle={styles.favoritesTitle}>
          <FetchedList
            {...favoritesSongs}
            itemComponent={song}
            emptyMessage="No Favorites"
            style={styles.listScreen}
            noScroll={true}
          />
        </List.Section>
        <List.Section title="Albums" titleStyle={styles.favoritesTitle}>
          <FetchedList
            {...favoritesAlbums}
            itemComponent={album}
            emptyMessage="No Favorites"
            style={styles.listScreen}
            noScroll={true}
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
            emptyMessage="No Favorites"
            style={styles.listScreen}
            noScroll={true}
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
