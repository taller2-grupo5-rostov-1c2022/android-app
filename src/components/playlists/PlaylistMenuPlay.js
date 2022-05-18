import React from "react";
import Modal from "../general/Modal";
import PropTypes from "prop-types";
import { useSWR, json_fetcher, webApi } from "../../util/services";
import { View } from "react-native";
import PlayableSongItem from "../songs/PlayableSongItem";
import { Button } from "react-native-paper";
import AppContext from "../AppContext.js";
import { playSongList } from "../../util/general";
import FetchedList from "../general/FetchedList";

export const PlaylistMenuPlay = ({ visible, setVisible, playlistId }) => {
  const context = React.useContext(AppContext);

  const playlist = useSWR(
    `${webApi}/songs/playlists/${playlistId}`,
    json_fetcher
  );
  const name = playlist?.data?.name ?? "";

  return (
    <Modal title={name} visible={visible} onDismiss={() => setVisible(false)}>
      <Button
        icon="playlist-play"
        onPress={() => playSongList(playlist?.data?.songs, context)}
        mode="contained"
        style={{
          width: "40%",
          position: "relative",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        Play
      </Button>
      <View style={{ width: "100%" }}>
        <FetchedList
          response={{
            data: playlist?.data?.songs,
            isValidating: playlist?.isValidating,
          }}
          itemComponent={PlayableSongItem}
          emptyMessage="This playlist has no songs"
        />
      </View>
    </Modal>
  );
};

export default PlaylistMenuPlay;

PlaylistMenuPlay.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  playlistId: PropTypes.any,
};
