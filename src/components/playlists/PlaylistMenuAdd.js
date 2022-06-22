import React from "react";
import { List } from "react-native-paper";
import Modal from "../general/Modal";
import PropTypes from "prop-types";
import { useSWR, json_fetcher, MY_PLAYLISTS_URL } from "../../util/services";
import FetchedList from "../general/FetchedList";
import { addSongToPlaylist, addColabToPlaylist } from "../../util/requests";

export const PlaylistMenuAdd = ({ visible, setVisible, songId, colabId }) => {
  const my_playlists = useSWR(MY_PLAYLISTS_URL, json_fetcher);

  const addSong = async (playlistId) => {
    try {
      await addSongToPlaylist(playlistId, songId);
      toast.show("Added song to playlist :)");
    } catch (e) {
      toast.show("Failed to add song :(");
      console.error(e);
    }
  };

  const addColab = async (playlistId) => {
    try {
      await addColabToPlaylist(playlistId, colabId);
      toast.show("Added colab to playlist :)");
    } catch (e) {
      toast.show("Failed to add colab :(");
      console.error(e);
    }
  };

  const onPress = (playlistId) => {
    setVisible(false);
    songId && addSong(playlistId);
    colabId && addColab(playlistId);
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
      scroll={false}
    >
      <FetchedList
        {...my_playlists}
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
  colabId: PropTypes.any,
};
