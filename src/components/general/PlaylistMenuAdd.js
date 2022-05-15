import React from "react";
import { IconButton } from "react-native-paper";
import Modal from "./Modal";
import PropTypes from "prop-types";

export const PlaylistMenuAdd = ({ visible, setVisible }) => {
  return (
    <Modal
      title="Add to playlist"
      visible={visible}
      onDismiss={() => setVisible(false)}
    >
      <IconButton icon="camera" size={20} onPress={() => setVisible(false)} />
    </Modal>
  );
};

export default PlaylistMenuAdd;

PlaylistMenuAdd.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};
