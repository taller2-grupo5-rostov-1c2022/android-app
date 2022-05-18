import React from "react";
import { List } from "react-native-paper";
import Modal from "./Modal";
import PropTypes from "prop-types";
import { useSWR, json_fetcher, webApi } from "../../util/services";
import FetchedList from "./FetchedList";

export const PlaylistMenuAdd = ({ visible, setVisible, songId }) => {
  const my_playlists = useSWR(webApi + "/songs/my_playlists/", json_fetcher);

  const onPress = () => {
    console.log(songId);
  };

  const playlist = ({ data }) => (
    <List.Item
      title={data.name}
      description={data.description}
      onPress={onPress}
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
