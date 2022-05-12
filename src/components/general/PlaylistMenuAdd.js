import React from "react";
import { IconButton, Portal, Modal } from "react-native-paper";

export const PlaylistMenuAdd = (visible, setVisible) => {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={() => setVisible(false)}>
        <IconButton
          icon="camera"
          size={20}
          onPress={() => console.log("Pressed")}
        />
      </Modal>
    </Portal>
  );
};

export default PlaylistMenuAdd;
