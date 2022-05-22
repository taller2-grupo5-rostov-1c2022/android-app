import React from "react";
import { List } from "react-native-paper";
import Modal from "../general/Modal";
import PropTypes from "prop-types";
import { useSWR, json_fetcher, webApi } from "../../util/services";
import FetchedList from "../general/FetchedList";
import { addSongToPlaylist } from "../../util/requests";

export const PlaylistMenuAdd = ({ visible, setVisible, songId }) => {
  const my_playlists = useSWR(webApi + "/songs/my_playlists/", json_fetcher);

  const onPress = (id) => {
    console.log("playlist id: " + id);
    console.log("song id: " + songId);
    setVisible(false);
    try {
      addSongToPlaylist(id, songId);
    } catch (e) {
      toast.show("Failed to add song :(");
      return;
    }
    toast.show("Added song to playlist :)", { duration: 2000 });
  };

  const playlist = ({ data }) => (
    <List.Item
      title={data.name}
      description={data.description}
      onPress={() => onPress(data.id)}
    />
  );

  return (
    <Modal
      title="Add to playlist"
      visible={visible}
      onDismiss={() => setVisible(false)}
    >
      <FetchedList
        response={my_playlists}
        itemComponent={playlist}
        emptyMessage={"You don't have any playlists"}
      />
    </Modal>
  );
};

export default PlaylistMenuAdd;

PlaylistMenuAdd.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  songId: PropTypes.any,
};
