import PropTypes from "prop-types";
import { useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Button, Title, useTheme } from "react-native-paper";
//import { ALBUMS_URL, useSWR, json_fetcher } from "../../../util/services";
//import { SessionContext } from "../../session/SessionProvider";
import { Portal } from "react-native-paper";
import Comment from "./Comment";


const AlbumComments = ({ albumId }) => {
  const theme = useTheme();
  //const { user } = useContext(SessionContext);
//   const {
//     data: comments,
//     error,
//     isValidating,
//   } = useSWR(`${ALBUMS_URL}${albumId}/comments/`, json_fetcher);
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
  const error = null
  const isValidating = false
  const [inComment, setInComment] = useState(false);
  const [commentStack, setCommentStack] = useState([])
  const [currentComment, setCurrentComment] = useState([]);
  const [commenting, setCommenting] = useState(false);
//   const userReview = comments?.find(
//     (comment) => comment?.commenter?.id === user?.id
//   );

  const onAddComment = () => {
    console.log(albumId);
    setCommenting(true);
  };

  const onComment = (pressedComment) => {
    if (!pressedComment.comment) return;
    console.log("comment")
    setCommentStack((commentStack) => [...commentStack, comments])
    setComments([pressedComment.comment]);
    setInComment(true);
    setCurrentComment((currentComment) => [...currentComment, pressedComment])
  };

  const onBack = () => {
    if (commentStack.length <= 0) return;
    console.log("back");
    const lastComments = commentStack[commentStack.length - 1];
    console.log(commentStack);
    setComments(lastComments);
    if (commentStack.length <= 1) setInComment(false);
    setCommentStack(commentStack.slice(0, -1));
    setCurrentComment(currentComment.slice(0, -1));
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
                {inComment ? currentComment[currentComment.length - 1].name : ""}
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
                {comment.name}
              </Text>
              {comment.text ? <Text onPress={() => onComment(comment)}>
              {inComment ? "Reply: " : "Comment: "}
              {comment.text}</Text> : null}
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
          initialComment={comment}
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
