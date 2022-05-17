import React from "react";
import Modal from "../general/Modal";
import PropTypes from "prop-types";
import { useSWR, json_fetcher, webApi } from "../../util/services";
import { View } from "react-native";
import PlayableSongItem from "../songs/PlayableSongItem";
import { Button } from "react-native-paper";
import AppContext from "../AppContext.js";

export const PlaylistMenuPlay = ({ visible, setVisible, playlistId }) => {
  const context = React.useContext(AppContext);

  const playlist = useSWR(`${webApi}/songs/playlists/${playlistId}`, json_fetcher);
  const name = playlist?.data?.name ?? "";

  const playPlaylist = () => {
    let first = false;
    const songs = [];
    playlist?.data?.songs?.map((song) => {
      songs.push(song);
    })
    try {
      console.log("fetch :"  + webApi + "/songs/songs/" + songs[0].id);
      let res = fetch(webApi + "/songs/songs/" + songs[0].id);
      songs[0].url = res.file;
      context.setSong(songs[0]);
    } catch (e) {
      console.error(e);
      toast.show("Could not play song :(", {
        duration: 3000,
      });
    }
  }
  let i = 0;
  return (
    <Modal
      title={name}
      visible={visible}
      onDismiss={() => setVisible(false)}
    >
      <Button icon="playlist-play" onPress={playPlaylist} mode='outlined'>
        Play
      </Button>
      <View style={{ width: "100%" }}>
        {playlist?.data?.songs?.map((song) => (
          <PlayableSongItem
            data={song}
            key={i++}
          />
        ))}
      </View>
    </Modal>
  );
};

export default PlaylistMenuPlay;

PlaylistMenuPlay.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  playlistId: PropTypes.any
};
