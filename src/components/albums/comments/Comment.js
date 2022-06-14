import React from "react";
import Modal from "../../general/Modal";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useComments } from "../../../util/requests";

const Comment = ({ visible, setVisible, parentComment, currentComment, albumId, inComment }) => {
  let edit = currentComment ? true : false;
  const replyOrComment = inComment ? "Reply" : "Comment"
  const [text, setText] = React.useState();
  const { saveComment, editComment, deleteComment } = useComments();

  const updateText = () => {
    edit = currentComment ? true : false;
    if (!edit){
        setText("");
        return;
    }
    setText(currentComment.text);
  }

  const hide = () => {
    updateText();
    setVisible(false);
  }

  const onCancel = () => {
    hide()
  };

  const onDeleteComment = () => {
    console.log("comment id: " + currentComment.id);
    try {
      deleteComment(albumId, currentComment.id);
    } catch (e) {
      toast.show("Failed to delete " + replyOrComment + " :(");
      return;
    }
    toast.show("Deleted " + replyOrComment + " :)", { duration: 2000 });
    hide();
  };

  React.useEffect(() => {
    updateText();
    console.log("currentComment: " + currentComment?.text);
  }, [JSON.stringify(currentComment)]);

  React.useEffect(() => {
    //console.log("currentComment: " + currentComment?.text);
    console.log("TEXT: " + text);
    // console.log("album id: " + albumId);
  }, [visible]);

  const onSaveComment = () => {
    console.log("text: " + text);

    const newComment = {
      text: text,
    };

    if (!text) {
      toast.show("write a " + replyOrComment + " first", { duration: 2000 });
      return;
    }

    try {
      if (edit) {
        editComment(albumId, currentComment.id, newComment);
      } else {
        if (inComment) {
            newComment.parent_id = parentComment.id;
        }
        saveComment(albumId, newComment);
      }
    } catch (e) {
      toast.show("Failed to save " + replyOrComment + " :(");
      return;
    }
    toast.show("Saved " + replyOrComment + " :)", { duration: 2000 });
    hide();
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
          value={text ? text : ""}
          onChangeText={(text) => setText(text)}
          multiline={true}
          numberOfLines={5}
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
  parentComment: PropTypes.shape({
    id: PropTypes.number
  }),
  currentComment: PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.text
  })
};
