import React from "react";
import Modal from "../general/Modal";
import PropTypes from "prop-types";
import { useSWR, json_fetcher, PLAYLISTS_URL } from "../../util/services";
import SongList from "../songs/SongList";

export const PlaylistMenuPlay = ({ visible, setVisible, playlistId }) => {
  const playlist = useSWR(`${PLAYLISTS_URL}${playlistId}`, json_fetcher);
  const name = playlist?.data?.name ?? "";

  return (
    <Modal title={name} visible={visible} onDismiss={() => setVisible(false)}>
      <SongList
        songs={playlist?.data?.songs}
        isValidating={playlist?.isValidating}
        emptyMessage="This playlist has no songs"
      />
    </Modal>
  );
};

export default PlaylistMenuPlay;

PlaylistMenuPlay.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  playlistId: PropTypes.any,
};
