import React, { useState, useEffect } from "react";
import Modal from "../general/Modal";
import PropTypes from "prop-types";
import { ShapedImage } from "../general/ShapedImage";
import { View } from "react-native";
import styles from "../styles";
import { Caption, Subheading, Title, Text } from "react-native-paper";
import { getArtistsAsString } from "../../util/general";
import { PlaylistMenuAdd } from "../playlists/PlaylistMenuAdd";
import SongList from "../songs/SongList";
import AlbumReviews from "./Reviews/AlbumReviews";
import AlbumComments from "./comments/AlbumComments.js";
import { useSWR, ALBUMS_URL, json_fetcher } from "../../util/services";
import StarRating from "react-native-star-rating-widget";

export default function AlbumInfo({ modalStatus, setModalStatus }) {
  const album = modalStatus?.album;
  const [playlistAdd, setPlaylistAdd] = useState({
    visible: false,
    id: null,
  });
  const response = useSWR(
    `${ALBUMS_URL}${modalStatus?.album?.id}`,
    json_fetcher,
    { isPaused: () => !modalStatus.visible }
  );
  const artists = getArtistsAsString(
    response?.data?.songs?.map((song) => song?.artists).flat()
  );

  useEffect(() => {
    if (!response.error) return;
    console.error(response.error);
    toast.show("Error loading album songs");
  }, [response.error]);

  return (
    <>
      <Modal
        title="Album Information"
        visible={modalStatus.visible && !playlistAdd.visible}
        onDismiss={() => setModalStatus({ album, visible: false })}
      >
        <View style={[styles.containerCenter]}>
          <Title style={{ margin: 0 }}>{album?.name}</Title>
          <Subheading>{album?.genre}</Subheading>
          {album?.scores_amount ? (
            <StarRating
              rating={album.score / 2}
              onChange={() => {}}
              maxStars={5}
              style={{ alignSelf: "center", marginBottom: 10 }}
              animationConfig={{ scale: 1 }}
              color="#FBB52C"
              starSize={20}
            />
          ) : null}
          <ShapedImage
            imageUri={album?.cover}
            shape="square"
            icon="album"
            size={200}
            style={{ marginBottom: 10 }}
          />
          {artists ? <Text>{artists}</Text> : null}
          <Caption>{album?.description}</Caption>
          <SongList
            onPlaylistAdd={(data) =>
              setPlaylistAdd({ visible: true, id: data.id })
            }
            songs={response?.data?.songs}
            title="Songs"
            emptyMessage="This album has no songs"
          />
        </View>
        <AlbumReviews albumId={album?.id} />
        <AlbumComments albumId={album?.id} />
      </Modal>
      <PlaylistMenuAdd
        visible={playlistAdd.visible && modalStatus.visible}
        setVisible={(value) =>
          setPlaylistAdd((prev) => ({ ...prev, visible: value }))
        }
        songId={playlistAdd.id}
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
