import { useEffect, useState } from "react";
import Modal from "../../general/Modal";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useReview } from "../../../util/requests";
import DropDown from "react-native-paper-dropdown";

const Review = ({ visible, setVisible, initialReview, albumId }) => {
  const currentReview = initialReview;
  const [text, setText] = useState(initialReview?.text ?? "");
  const { saveReview, deleteReview } = useReview();

  const [showDropDown, setShowDropDown] = useState(false);
  const [score, setScore] = useState(initialReview?.score ?? 7);
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

  const onDeleteReview = () => {
    try {
      deleteReview(albumId);
    } catch (e) {
      toast.show("Failed to delete Review :(");
      return;
    }
    toast.show("Deleted Review :)", { duration: 2000 });
  };

  useEffect(() => {
    setText(initialReview?.text);
    setScore(initialReview?.score);
  }, [initialReview]);

  const onSaveReview = () => {
    const newReview = {
      score: score,
      text: text,
    };

    if (!text) {
      toast.show("write a Review first", { duration: 2000 });
      return;
    }

    try {
      saveReview(albumId, newReview, currentReview);
      // setCurrentReview(newReview);
    } catch (e) {
      toast.show("Failed to save Review :(");
      return;
    }
    toast.show("Saved Review :)", { duration: 2000 });
    setVisible(false);
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
            <Button onPress={onDeleteReview}>Delete</Button>
          ) : null}
          <Button onPress={onSaveReview}>Submit</Button>
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
      name: PropTypes.string,
      id: PropTypes.string,
    }),
  }),
};
