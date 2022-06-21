import React from "react";
import {
  Headline,
  IconButton,
  Modal as PaperModal,
  Surface,
} from "react-native-paper";
import styles from "../styles";
import { View, ScrollView } from "react-native";
import PropTypes from "prop-types";
import {} from "react-native";

export default function Modal({ title, onDismiss, children, scroll, ...rest }) {
  let Container = scroll ? ScrollView : View;
  return (
    <PaperModal
      {...{ onDismiss, ...rest }}
      contentContainerStyle={[styles.modal]}
      style={styles.modalContainer}
    >
      <Surface style={{ maxHeight: "100%" }}>
        <View style={[styles.header, styles.modalMargin]}>
          <Headline style={{ fontSize: 20 }}>{title}</Headline>
          <IconButton icon="close" onPress={onDismiss} />
        </View>
        <Container style={styles.modalMargin}>{children}</Container>
      </Surface>
    </PaperModal>
  );
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  scroll: PropTypes.bool,
  ...PaperModal.propTypes,
};

Modal.defaultProps = {
  scroll: true,
};
