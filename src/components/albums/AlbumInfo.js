import React from "react";
import Modal from "../general/Modal";
import PropTypes from "prop-types";
import { ShapedImage } from "../general/ShapedImage";
import { View } from "react-native-web";
import styles from "../styles";
import {
  Caption,
  Subheading,
  Title,
  Text,
  List,
  IconButton,
} from "react-native-paper";
import { getArtistsAsString } from "../../util/general";
import { PlaylistMenuAdd } from "../general/PlaylistMenuAdd";

export default function AlbumInfo({ modalStatus, setModalStatus }) {
  const album = modalStatus?.album;
  const artists = getArtistsAsString(
    album?.songs?.map((song) => song?.artists).flat()
  );
  const [playlistVisible, setPlaylistVisible] = React.useState(false);

  let i = 0;
  return (
    <>
      <Modal
        title="Album Information"
        visible={modalStatus.visible && !playlistVisible}
        onDismiss={() => setModalStatus({ album, visible: false })}
      >
        <View style={styles.containerCenter}>
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
          <View style={{ width: "100%" }}>
            {album?.songs?.map((song) => (
              <List.Item
                key={i++}
                title={song.name}
                description={getArtistsAsString(song.artists)}
                right={() => (
                  <IconButton
                    onPress={() => setPlaylistVisible(true)}
                    icon="playlist-plus"
                    color="black"
                    style={{ float: "right" }}
                  />
                )}
              />
            ))}
          </View>
        </View>
      </Modal>
      <PlaylistMenuAdd
        visible={playlistVisible && modalStatus.visible}
        setVisible={setPlaylistVisible}
      ></PlaylistMenuAdd>
    </>
  );
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
