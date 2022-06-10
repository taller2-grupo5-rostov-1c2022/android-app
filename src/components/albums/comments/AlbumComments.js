import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { View } from "react-native";
import { Text, List } from "react-native-paper";
import { IconButton, Button, Title, useTheme } from "react-native-paper";
import { ALBUMS_URL, useSWR, json_fetcher } from "../../../util/services";
//import { SessionContext } from "../../session/SessionProvider";
import { Portal } from "react-native-paper";
import Comment from "./Comment";
import { getAuth } from "firebase/auth";


const AlbumComments = ({ albumId }) => {
  const userId = getAuth()?.currentUser?.uid;
  const theme = useTheme();
  //const { user } = useContext(SessionContext);
  let {
    data: initComments,
    error,
    isValidating,
  } = useSWR(`${ALBUMS_URL}${albumId}/comments/`, json_fetcher);
  const commentt = {
    text: "algo mas",
    comment: null,
    name: "tomas"
  }
  const commenttt = {
    text: "caca",
    comment: null,
    name: "tomas"
  }
  const comment = {
    text: "algo",
    comment: commentt,
    name: "jose"
  }
  const comment2 = {
    text: "algo",
    comment: commenttt,
    name: "jose"
  }
  const [comments, setComments] = useState([comment, comment2]);
  //comments.length = 7
  const [inComment, setInComment] = useState(false);
  const [commentStack, setCommentStack] = useState([])
  const [currentComment, setCurrentComment] = useState([]);
  const [commenting, setCommenting] = useState(false);
  const [editComment, setEditComment] = useState(null);
  const [isReplying, setIsReplying] = useState(false);
//   const userReview = comments?.find(
//     (comment) => comment?.commenter?.id === user?.id
//   );
  useEffect(() => {
    setComments(initComments);
    setCommentStack([]);
    setInComment(false);
    setCurrentComment([]);
  },[initComments]);

  useEffect(() => {
    console.log(editComment);
    if (!commenting){
      console.log("borrando edit comment");
      setEditComment(null);
      if (isReplying) {
        onBack();
        setIsReplying(false);
      }
    }
  },[commenting]);

  const onAddComment = () => {
    console.log(albumId);
    setCommenting(true);
  };

  const onComment = (pressedComment) => {
    console.log(comments);
    if (!pressedComment.responses) return;
    console.log(pressedComment.responses);
    setCommentStack((commentStack) => [...commentStack, comments])
    setComments(pressedComment.responses);
    //comments = pressedComment.responses;
    console.log(comments)
    setInComment(true);
    setCurrentComment((currentComment) => [...currentComment, pressedComment])
  };

  const onBack = () => {
    if (commentStack.length <= 0) return;
    console.log("back");
    const lastComments = commentStack[commentStack.length - 1];
    console.log(commentStack);
    setComments(lastComments);
    //comments = lastComments;
    if (commentStack.length <= 1) setInComment(false);
    setCommentStack(commentStack.slice(0, -1));
    setCurrentComment(currentComment.slice(0, -1));
  }

  const isUser = (commenterId) => {
    if (commenterId == userId) return true;
    return false;
  }

  const onEditComment = (comment) => {
    setEditComment(comment);
    setCommenting(true);
  }

  const onReply = (comment) => {
    setIsReplying(true);
    onComment(comment);
    onAddComment();
  }

  const replyButton = (commenterId, comment) => {
    return ([
      isUser(commenterId) ? 
      <IconButton icon="pencil-outline" key={2} onPress={() => onEditComment(comment)}></IconButton> 
      : null,
      <IconButton icon="reply" key={1} onPress={() => onReply(comment)}></IconButton>
    ])
  }

  return (
    <>
      <View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Title>Comments</Title>
          <Button onPress={onBack} disabled={!inComment}>
            {inComment ? "Back" : ""}
          </Button>
          <Button onPress={onAddComment}>
            {inComment ? "Reply" : "Comment"}
          </Button>
        </View>
        <View disabled={!inComment}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                {inComment ? currentComment[currentComment.length - 1].commenter.name : ""}
            </Text>
            {inComment ? 
            <Text style={{fontSize: 18}}> 
                Comment: {currentComment[currentComment.length - 1].text} 
            </Text>
            : null}
        </View>
        {comments?.length == 0 ? (
          <Text
            style={{
              margin: 10,
              color: theme.colors.text,
            }}
          >
            {inComment ? "No Reply" : "No Comment"}
          </Text>
        ) : null}
        {
          // FIXME: UI de prueba
          comments?.map((comment, index) => (
            <View
              key={index}
              style={{
                margin: 10,
                borderBottom: "1px solid black",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {comment?.commenter?.name}
              </Text>
              <List.Item onPress={() => onComment(comment)}
              tittle={inComment ? "Reply: " : "Comment: "}
              description={comment.text ? comment.text : "[Deleted]"}
              right={() => replyButton(comment.commenter?.id, comment)}/>
            </View>
          ))
        }
        {!comments && isValidating ? (
          <Text style={{ margin: 10, color: theme.colors.text }}>
            Loading...
          </Text>
        ) : null}
        {!comments && error ? (
          <Text style={{ margin: 10, color: theme.colors.text }}>error</Text>
        ) : null}
      </View>
      <Portal>
        <Comment
          visible={!!commenting}
          setVisible={setCommenting}
          albumId={albumId}
          parentComment={inComment ? currentComment[currentComment.length - 1] : null}
          currentComment={editComment}
          inComment={inComment}
        />
      </Portal>
    </>
  );
};

AlbumComments.propTypes = {
  albumId: PropTypes.number,
};

export default AlbumComments;
