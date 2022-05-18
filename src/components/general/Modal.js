import React from "react";
import {
  Headline,
  IconButton,
  Modal as PaperModal,
  Surface,
} from "react-native-paper";
import styles from "../styles";
import { View } from "react-native";
import PropTypes from "prop-types";
import { ScrollView } from "react-native";

export default function Modal({ title, onDismiss, children, ...rest }) {
  return (
    <PaperModal
      {...{ onDismiss, ...rest }}
      contentContainerStyle={[styles.modal]}
      style={styles.modalContainer}
    >
      <Surface>
        <View style={[styles.header, styles.modalMargin]}>
          <Headline style={{ fontSize: 20 }}>{title}</Headline>
          <IconButton icon="close" onPress={onDismiss} />
        </View>
        <ScrollView style={styles.modalMargin}>{children}</ScrollView>
      </Surface>
    </PaperModal>
  );
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  ...PaperModal.propTypes,
};
