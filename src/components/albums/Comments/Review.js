import Modal from "../../general/Modal";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import { useComments } from "../../../util/requests";

const Review = ({ visible, setVisible, initialReview, albumId }) => {
  const currentReview = initialReview;

  const { saveComment, deleteComment } = useComments();

  const onDeleteComment = () => {
    try {
      deleteComment(albumId);
    } catch (e) {
      toast.show("Failed to delete comment :(");
      return;
    }
    toast.show("Deleted comment :)", { duration: 2000 });
  };

  const onSaveComment = () => {
    const newReview = {
      score: currentReview ? 6 : 5,
      text: "Hola. Hace la actividad como te parezca, y agrega las aclaraciones que sean necesarias. Saludos.",
    };

    try {
      saveComment(albumId, newReview, currentReview);
      // setCurrentReview(newReview);
    } catch (e) {
      toast.show("Failed to save comment :(");
      return;
    }
    toast.show("Saved comment :)", { duration: 2000 });
  };

  return (
    <Modal
      title={currentReview ? "Edit Review" : "Add Review"}
      visible={visible}
      onDismiss={() => setVisible(false)}
    >
      <View
        style={{
          margin: 20,
        }}
      >
        {currentReview ? (
          <Text>
            {currentReview?.score} - {currentReview?.text}
          </Text>
        ) : (
          <Text>New Review</Text>
        )}
        <View>
          <Button onPress={() => setVisible(false)}>Cancel</Button>
          {currentReview && <Button onPress={onDeleteComment}>Delete</Button>}
          <Button onPress={onSaveComment}>Submit</Button>
        </View>
      </View>
    </Modal>
  );
};

export default Review;

Review.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  albumId: PropTypes.number.isRequired,
  initialReview: PropTypes.shape({
    text: PropTypes.string,
    score: PropTypes.number,
    commenter: PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired,
  }),
};
