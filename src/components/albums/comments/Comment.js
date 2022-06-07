import React from "react";
import Modal from "../../general/Modal";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
//import { useComments } from "../../../util/requests";

const Comment = ({ visible, setVisible, initialComment, albumId, inComment }) => {
  const currentComment = initialComment;
  const replyOrComment = inComment ? "Reply" : "Comment"
  const [text, setText] = React.useState(initialComment?.text ?? "");
  //const { saveComment, deleteComment } = useComments();

  const [score, setScore] = React.useState(initialComment?.score ?? 7);

  const onCancel = () => {
    setText(initialComment?.text);
    setVisible(false);
  };

  const onDeleteComment = () => {
    try {
      //deleteComment(albumId);
    } catch (e) {
      toast.show("Failed to delete " + replyOrComment + " :(");
      return;
    }
    toast.show("Deleted " + replyOrComment + " :)", { duration: 2000 });
  };

  React.useEffect(() => {
    setText(initialComment?.text);
    setScore(initialComment?.score);
    console.log("currentComment: " + currentComment?.text);
    console.log("text: " + text);
    console.log("album id: " + albumId);
  }, [initialComment]);

  React.useEffect(() => {
    console.log("currentComment: " + currentComment?.text);
    console.log("text: " + text);
    console.log("album id: " + albumId);
  }, [visible]);

  const onSaveComment = () => {
    const newComment = {
      score: score,
      text: text,
    };

    if (!text) {
      toast.show("write a " + replyOrComment + " first", { duration: 2000 });
      return;
    }

    try {
      //saveComment(albumId, newComment, currentComment);
      // setCurrentComment(newComment);
    } catch (e) {
      toast.show("Failed to save " + replyOrComment + " :(");
      return;
    }
    toast.show("Saved " + replyOrComment + " :)", { duration: 2000 });
    //setVisible(false);
  };

  return (
    <Modal
      title={currentComment ? "Edit " + replyOrComment : "Add " + replyOrComment}
      visible={visible}
      onDismiss={onCancel}
    >
      <View
        style={{
          margin: 20,
        }}
      >
        <TextInput
          placeholder={replyOrComment}
          mode={"outlined"}
          value={text}
          onChangeText={(text) => setText(text)}
          multiline={true}
        />
        <View>
          <Button onPress={onCancel}>Cancel</Button>
          {currentComment ? (
            <Button onPress={onDeleteComment}>Delete</Button>
          ) : null}
          <Button onPress={onSaveComment}>Submit</Button>
        </View>
      </View>
    </Modal>
  );
};

export default Comment;

Comment.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  albumId: PropTypes.number.isRequired,
  inComment: PropTypes.bool.isRequired,
};
