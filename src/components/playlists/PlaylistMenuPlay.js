import React from "react";
import Modal from "../general/Modal";
import PropTypes from "prop-types";
import { useSWR, json_fetcher, webApi, fetch } from "../../util/services";
import { View } from "react-native";
import PlayableSongItem from "../songs/PlayableSongItem";
import { Button } from "react-native-paper";
import AppContext from "../AppContext.js";

export const PlaylistMenuPlay = ({ visible, setVisible, playlistId }) => {
  const context = React.useContext(AppContext);

  const playlist = useSWR(`${webApi}/songs/playlists/${playlistId}`, json_fetcher);
  const name = playlist?.data?.name ?? "";

  const playPlaylist = () => {
    let first = true;
    context.setQueue([]); //play playlist resets queue
    playlist?.data?.songs?.map(async (song) => {
      if (first) {
        try {
          let res = await fetch(webApi + "/songs/songs/" + song.id);
          song.url = res.file;
          context.setSong(song);
        } catch (e) {
          console.error(e);
          toast.show("Could not play song :(", {
            duration: 3000,
          });
        }
        first = false;
      } else {
        try {
          let res = await fetch(webApi + "/songs/songs/" + song.id);
          song.url = res.file;
          context.setQueue((queue) => [...queue, song]);
        } catch (e) {
          console.error(e);
        }
      }
    })
  }
  let i = 0;
  return (
    <Modal
      title={name}
      visible={visible}
      onDismiss={() => setVisible(false)}
    >
      <Button 
        icon="playlist-play" 
        onPress={playPlaylist} 
        mode='contained' 
        style={{width: "40%", position: 'relative', justifyContent: 'center', alignSelf: 'center'}}
      >
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
