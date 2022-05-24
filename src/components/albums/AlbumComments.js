import PropTypes from "prop-types";
import { View, Text } from "react-native";
import { Button, Title } from "react-native-paper";
import { webApi, useSWR, json_fetcher } from "../../util/services";

const AlbumComments = ({ albumId }) => {
  const {
    data: comments,
    error,
    isValidating,
  } = useSWR(webApi + "/songs/albums/" + albumId + "/comments/", json_fetcher);
  /* Comment Schema:
    {
      text: "buenas vibras",
      score: 8,
      commenter: {
        name: "Whiskers",
      },
    }
    */

  const alreadyReviewed = false;
  // comments.some( (comment) => comment?.commenter?.id === uid ); // no id yet

  const addReview = () => {
    console.log("addReview");
    console.log("should handle", error, isValidating);
    // FIXME: handle error and isValidating
  };

  const editReview = () => {
    // Maybe this could be merged with the one above
    // Similar to how put/post of songs share the same form
  };

  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Title>Reviews</Title>
        {alreadyReviewed ? (
          <Button onPress={addReview}>Add Review</Button>
        ) : (
          <Button onPress={editReview}>Edit Review</Button>
        )}
      </View>
      {comments?.length == 0 && (
        <Text
          style={{
            margin: 10,
          }}
        >
          No hay Comentarios
        </Text>
      )}
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
            <Text style={{ fontWeight: "bold" }}>{comment.commenter.name}</Text>
            {comment.score && <Text>Sore: {comment.score}</Text>}
            {comment.text && <Text>Comment: {comment.text}</Text>}
          </View>
        ))
      }
    </View>
  );
};

AlbumComments.propTypes = {
  albumId: PropTypes.number,
};

export default AlbumComments;
