import React from "react";
import Modal from "../general/Modal";
import PropTypes from "prop-types";
import { ShapedImage } from "../general/ShapedImage";
import { View } from "react-native";
import styles from "../styles";
import {
  Caption,
  Subheading,
  Title,
  Text,
  IconButton,
  Button,
} from "react-native-paper";
import { getArtistsAsString } from "../../util/general";
import { PlaylistMenuAdd } from "../general/PlaylistMenuAdd";
import PlayableSongItem from "../songs/PlayableSongItem";
import { webApi, fetch } from "../../util/services";
import AppContext from "../AppContext";
import FetchedList from "../general/FetchedList";

export default function AlbumInfo({ modalStatus, setModalStatus }) {
  const album = modalStatus?.album;
  const artists = getArtistsAsString(
    album?.songs?.map((song) => song?.artists).flat()
  );
  const [playlistAdd, setPlaylistAdd] = React.useState({
    visible: false,
    id: null,
  });
  const context = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(false);

  let playAllButton = null;
  if (album?.songs.length > 0)
    playAllButton = (
      <Button
        mode="contained"
        style={([styles.button], { marginTop: "3%" })}
        onPress={() => playAll(album?.songs, context, setLoading)}
        disabled={loading ? "true" : undefined}
        icon={loading ? undefined : "play"}
        loading={loading}
      >
        Play Album
      </Button>
    );

  let songs = album?.songs;

  let song = ({ data }) => (
    <PlayableSongItem
      data={data}
      right={(props) => (
        <IconButton
          {...props}
          onPress={() => setPlaylistAdd({ value: true, id: data.id })}
          icon="playlist-plus"
        />
      )}
    />
  );

  return (
    <>
      <Modal
        title="Album Information"
        visible={modalStatus.visible && !playlistAdd.visible}
        onDismiss={() => setModalStatus({ album, visible: false })}
      >
        <View style={[styles.containerCenter, styles.container]}>
          <Title style={{ margin: 0 }}>{album?.name}</Title>
          <Subheading>{album?.genre}</Subheading>
          <ShapedImage
            imageUri={album?.cover}
            shape="square"
            icon="album"
            size={200}
            style={{ marginBottom: "2%" }}
          />

          <Text>{artists}</Text>
          <Caption>{album?.description}</Caption>
          {playAllButton}
          <View style={{ width: "100%", alignSelf: "flex-start" }}>
            <Title>Songs</Title>
            <FetchedList
              response={{ data: songs }}
              itemComponent={song}
              viewProps={{ style: { width: "100%" } }}
              emptyMessage="This album has no songs"
            />
          </View>
        </View>
      </Modal>
      <PlaylistMenuAdd
        visible={playlistAdd.visible && modalStatus.visible}
        setVisible={(value) =>
          setPlaylistAdd((prev) => ({ ...prev, visible: value }))
        }
        songId={playlistAdd.visible}
      ></PlaylistMenuAdd>
    </>
  );
}

async function playAll(songs, context, setLoading) {
  setLoading(true);
  try {
    let songsWithUrl = await Promise.all(
      songs.map((song) => fetch(webApi + "/songs/songs/" + song.id))
    );
    let queue = songsWithUrl.map((song) => {
      song.url = song.file;
      return song;
    });
    context.setQueue(queue);
    context.setNext(true);
    context.setPaused(false);
  } catch (e) {
    console.error(e);
    toast.show("Could not play album :(", {
      duration: 3000,
    });
  } finally {
    setLoading(false);
  }
}

AlbumInfo.propTypes = {
  modalStatus: PropTypes.shape({
    visible: PropTypes.bool.isRequired,
    album: PropTypes.shape({
      id: PropTypes.any,
      name: PropTypes.string,
      description: PropTypes.string,
      genre: PropTypes.string,
      cover: PropTypes.string,
      sub_level: PropTypes.number,
      songs: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          artists: PropTypes.arrayOf(
            PropTypes.shape({
              name: PropTypes.string.isRequired,
            }).isRequired
          ),
          genre: PropTypes.string.isRequired,
        })
      ),
    }),
  }).isRequired,

  setModalStatus: PropTypes.func.isRequired,
};
