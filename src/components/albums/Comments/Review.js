import React from "react";
import Modal from "../../general/Modal";
import PropTypes from "prop-types";
import { Text } from "react-native-paper";

export const Review = ({ visible, setVisible, review }) => {
  return (
    <Modal
      title={review ? "Edit Review" : "Add Review"}
      visible={visible}
      onDismiss={() => setVisible(false)}
    >
      <Text>{review?.text ?? "new review"}</Text>
    </Modal>
  );
};

export default Review;

Review.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  review: PropTypes.shape({
    text: PropTypes.string,
    score: PropTypes.number,
    commenter: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    }).isRequired,
  }),
};
