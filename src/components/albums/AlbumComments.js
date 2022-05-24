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

  const addReview = () => {
    console.log("addReview");
    console.log("should handle", error, isValidating);
    // FIXME: handle error and isValidating
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
        <Button onPress={addReview}>Add Review</Button>
      </View>
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
