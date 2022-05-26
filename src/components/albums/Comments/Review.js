import React from "react";
import Modal from "../../general/Modal";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useComments } from "../../../util/requests";
import DropDown from "react-native-paper-dropdown";

const Review = ({ visible, setVisible, initialReview, albumId }) => {
  const currentReview = initialReview;
  const [text, setText] = React.useState(initialReview?.text ?? "");
  const { saveComment, deleteComment } = useComments();

  const [showDropDown, setShowDropDown] = React.useState(false);
  const [score, setScore] = React.useState(initialReview?.score ?? 7);
  const scoreList = [
    {
      label: "0",
      value: 0,
    },
    {
      label: "1",
      value: 1,
    },
    {
      label: "2",
      value: 2,
    },
    {
      label: "3",
      value: 3,
    },
    {
      label: "4",
      value: 4,
    },
    {
      label: "5",
      value: 5,
    },
    {
      label: "6",
      value: 6,
    },
    {
      label: "7",
      value: 7,
    },
    {
      label: "8",
      value: 8,
    },
    {
      label: "9",
      value: 9,
    },
    {
      label: "10",
      value: 10,
    },
  ];

  const onCancel = () => {
    setText(initialReview?.text);
    setVisible(false);
  };

  const onDeleteComment = () => {
    try {
      deleteComment(albumId);
    } catch (e) {
      toast.show("Failed to delete comment :(");
      return;
    }
    toast.show("Deleted comment :)", { duration: 2000 });
  };

  React.useEffect(() => {
    setText(initialReview?.text);
    setScore(initialReview?.score);
    console.log("currentReview: " + currentReview?.text);
    console.log("text: " + text);
    console.log("album id: " + albumId);
  }, [initialReview]);

  React.useEffect(() => {
    console.log("currentReview: " + currentReview?.text);
    console.log("text: " + text);
    console.log("album id: " + albumId);
  }, [visible]);

  const onSaveComment = () => {
    const newReview = {
      score: score,
      text: text,
    };

    if (!text) {
      toast.show("write a comment first", { duration: 2000 });
      return;
    }

    try {
      saveComment(albumId, newReview, currentReview);
      // setCurrentReview(newReview);
    } catch (e) {
      toast.show("Failed to save comment :(");
      return;
    }
    toast.show("Saved comment :)", { duration: 2000 });
    //setVisible(false);
  };

  return (
    <Modal
      title={currentReview ? "Edit Review" : "Add Review"}
      visible={visible}
      onDismiss={onCancel}
    >
      <View
        style={{
          margin: 20,
        }}
      >
        <TextInput
          placeholder="Review"
          mode={"outlined"}
          value={text}
          onChangeText={(text) => setText(text)}
          multiline={true}
        />
        <DropDown
          label={"score"}
          mode={"outlined"}
          visible={showDropDown}
          showDropDown={() => setShowDropDown(true)}
          onDismiss={() => setShowDropDown(false)}
          value={score}
          setValue={setScore}
          list={scoreList}
        />
        <View>
          <Button onPress={onCancel}>Cancel</Button>
          {currentReview ? (
            <Button onPress={onDeleteComment}>Delete</Button>
          ) : null}
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
