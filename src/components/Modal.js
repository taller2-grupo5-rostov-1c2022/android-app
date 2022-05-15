import React from "react";
import { IconButton, Modal as _Modal, Title } from "react-native-paper";
import styles from "./styles";
import { View } from "react-native";
import PropTypes from "prop-types";

export default function Modal({ title, onDismiss, children, ...rest }) {
  return (
    <_Modal {...{ onDismiss, ...rest }}>
      <View style={styles.header}>
        <Title>{title}</Title>
        <IconButton icon="close" onPress={onDismiss} />
      </View>
      {children}
    </_Modal>
  );
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  ..._Modal.propTypes,
};
