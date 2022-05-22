import React from "react";
import Modal from "../../general/Modal";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Title } from "react-native-paper";

export default function Chat({ status, setStatus }) {
  const user = status?.user;
  return (
    <Modal
      title="Chat"
      visible={status.visible}
      onDismiss={() => setStatus({ user, visible: false })}
    >
      <View>
        <Title>WIP</Title>
      </View>
    </Modal>
  );
}

Chat.propTypes = {
  status: PropTypes.shape({
    visible: PropTypes.bool.isRequired,
    user: PropTypes.shape({
      id: PropTypes.any,
      name: PropTypes.string,
      location: PropTypes.string,
      interests: PropTypes.string,
      pfp: PropTypes.string,
    }),
  }).isRequired,

  setStatus: PropTypes.func.isRequired,
};
