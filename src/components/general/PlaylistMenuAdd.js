import React from "react";
import { IconButton } from "react-native-paper";
import Modal from "../Modal";
import styles from "../styles";
import PropTypes from "prop-types";

export const PlaylistMenuAdd = ({ visible, setVisible }) => {
  return (
    <Modal
      title="Add to playlist"
      visible={visible}
      contentContainerStyle={[styles.container, styles.modal]}
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
