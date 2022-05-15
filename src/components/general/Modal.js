import React from "react";
import { Headline, IconButton, Modal as _Modal } from "react-native-paper";
import styles from "../styles";
import { View } from "react-native";
import PropTypes from "prop-types";
import { ScrollView } from "react-native";

export default function Modal({ title, onDismiss, children, ...rest }) {
  return (
    <_Modal
      {...{ onDismiss, ...rest }}
      contentContainerStyle={[styles.container, styles.modal]}
    >
      <View style={[styles.header, styles.modalMargin]}>
        <Headline style={{ fontSize: "larger" }}>{title}</Headline>
        <IconButton icon="close" onPress={onDismiss} />
      </View>
      <ScrollView style={styles.modalMargin}>{children}</ScrollView>
    </_Modal>
  );
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  ..._Modal.propTypes,
};
