import React from "react";
import { View } from 'react-native';
import { IconButton, Menu, Divider, Provider, Portal } from 'react-native-paper';

const PlaylistMenuAdd = (visible, setVisible) => {

  return (
    <Portal>
        <Modal visible={visible}
        onDismiss={() => setVisible(false)}>
          <IconButton
            icon="camera"
            size={20}
            onPress={() => console.log('Pressed')}
          />
        </Modal>
    </Portal>
  );
};

export default PlaylistMenuAdd;