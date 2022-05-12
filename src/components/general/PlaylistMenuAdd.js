import React from "react";
import { IconButton, Portal, Modal } from "react-native-paper";

export const PlaylistMenuAdd = (visible, setVisible) => {
  return (
    <Portal>
      <Modal visible={false} onDismiss={() => console.log("dismiss")}>
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
