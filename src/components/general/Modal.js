import React from "react";
import { Headline, IconButton, Modal as PaperModal } from "react-native-paper";
import styles from "../styles";
import { View } from "react-native";
import PropTypes from "prop-types";
import { ScrollView } from "react-native";
import { useTheme } from "react-native-paper";

export default function Modal({ title, onDismiss, children, ...rest }) {
  let theme = useTheme();

  return (
    <PaperModal
      {...{ onDismiss, ...rest }}
      contentContainerStyle={[
        styles.modal,
        { backgroundColor: theme.colors.modal },
      ]}
      style={styles.modalContainer}
    >
      <View style={[styles.header, styles.modalMargin]}>
        <Headline style={{ fontSize: 20 }}>{title}</Headline>
        <IconButton icon="close" onPress={onDismiss} />
      </View>
      <ScrollView style={styles.modalMargin}>{children}</ScrollView>
    </PaperModal>
  );
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  ...PaperModal.propTypes,
};
