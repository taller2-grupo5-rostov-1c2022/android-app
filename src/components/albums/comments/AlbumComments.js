import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { View } from "react-native";
import { Text, List } from "react-native-paper";
import { IconButton, Button, Title, useTheme } from "react-native-paper";
import { ALBUMS_URL, useSWR, json_fetcher } from "../../../util/services";
import { Portal } from "react-native-paper";
import Comment from "./Comment";
import { getAuth } from "firebase/auth";

const AlbumComments = ({ albumId }) => {

  const userId = getAuth()?.currentUser?.uid;
  const theme = useTheme();
  let {
    data: initComments,
    error,
    isValidating,
  } = useSWR(`${ALBUMS_URL}${albumId}/comments/`, json_fetcher);

  const [comments, setComments] = useState([]);
  const [inComment, setInComment] = useState(false);
  const [commentStack, setCommentStack] = useState([])
  const [currentComment, setCurrentComment] = useState([]);
  const [commenting, setCommenting] = useState(false);
  const [editComment, setEditComment] = useState(null);
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    setComments(initComments);
    setCommentStack([]);
    setInComment(false);
    setCurrentComment([]);
  },[initComments]);

  useEffect(() => {
    if (!commenting){
      setEditComment(null);
      if (isReplying) {
        onBack();
        setIsReplying(false);
      }
    }
  },[commenting]);

  const onAddComment = () => {
    setCommenting(true);
  };

  const onComment = (pressedComment) => {
    if (!pressedComment.responses) return;
    setCommentStack((commentStack) => [...commentStack, comments])
    setComments(pressedComment.responses);
    setInComment(true);
    setCurrentComment((currentComment) => [...currentComment, pressedComment])
  };

  const onBack = () => {
    if (commentStack.length <= 0) return;

    const lastComments = commentStack[commentStack.length - 1];

    setComments(lastComments);
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

  const onBackToTop = () => {
    setComments(initComments);
    setCommentStack([]);
    setInComment(false);
    setCurrentComment([]);
  }

  const replyButton = (commenterId, comment) => {
    return ([
      isUser(commenterId) ? 
      <IconButton 
        icon="pencil-outline" 
        key={2} 
        onPress={() => onEditComment(comment)}>
      </IconButton> 
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
          { inComment ?
            <Button onPress={onBackToTop}>
              Back to top
            </Button> :
            <Button onPress={onAddComment}>
              Comment
            </Button>
          }
        </View>
        <View disabled={!inComment} style={{flexDirection: 'row', paddingBottom: 8}}>
          <View style={{flex: 1, flexWrap: 'wrap'}}>
            <Text style={{fontSize: 16 }}>
                {inComment ? currentComment[currentComment.length - 1].commenter.name : ""}
            </Text>
            {inComment ? 
              <Text style={{fontWeight: "bold", fontSize: 18, paddingLeft:0}}> 
                  {currentComment[currentComment.length - 1].text} 
              </Text>
              : null
            }
          </View>
          <View style={{flexWrap: 'wrap', flexDirection: "row"}}>
            {inComment ? 
              [<IconButton icon="undo" onPress={onBack} key={1}></IconButton>,
              <IconButton icon="reply" onPress={onAddComment} key={2}></IconButton>]
              : null
            }
          </View>
        </View>
        <View style={inComment ? {
          borderBottomLeftColor: "#000000", 
          borderLeftWidth: 3,
          marginLeft: 10, 
          paddingLeft: 10,
          marginBottom: 10
        } : {}}>
        {comments?.length == 0 ? (
          <Text
            style={{
              margin: 10,
              color: theme.colors.text,
              borderBottom: "1px solid black",
              fontSize: 16,
              fontWeight: "bold",
              paddingBottom: 5
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
              <Text style={{}}>
                {comment?.commenter?.name}
              </Text>
              <List.Item onPress={() => onComment(comment)}
                description={comment.text ? comment.text : "[Deleted]"}
                right={() => replyButton(comment.commenter?.id, comment)}
                descriptionStyle={{
                  fontWeight: "bold", 
                  fontSize: 16, 
                  color: theme.colors.text
                }}
                descriptionNumberOfLines={10}
              />
            </View>
          ))
        }
        </View>
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
