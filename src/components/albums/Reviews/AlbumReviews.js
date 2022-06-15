import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Button, Title, useTheme } from "react-native-paper";
import { ALBUMS_URL, useSWR, json_fetcher } from "../../../util/services";
import { SessionContext } from "../../session/SessionProvider";
import { Portal } from "react-native-paper";
import Review from "./Review";

const AlbumReviews = ({ albumId }) => {
  const theme = useTheme();
  const { user } = useContext(SessionContext);
  const {
    data: comments,
    error,
    isValidating,
  } = useSWR(`${ALBUMS_URL}${albumId}/reviews/`, json_fetcher);

  const [reviewing, setReviewing] = useState("");
  const userReview = comments?.find(
    (comment) => comment?.reviewer?.id === user?.id
  );

  const onReview = () => {
    setReviewing(true);
  };

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
          <Title>Reviews</Title>
          <Button onPress={onReview}>
            {userReview ? "Edit Review" : "Add Review"}
          </Button>
        </View>
        {comments?.length == 0 ? (
          <Text
            style={{
              margin: 10,
              color: theme.colors.text,
            }}
          >
            No Review
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
                {comment.reviewer.name}
              </Text>
              {comment.score ? <Text>Score: {comment.score}</Text> : null}
              {comment.text ? <Text>Review: {comment.text}</Text> : null}
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
        <Review
          visible={!!reviewing}
          setVisible={setReviewing}
          albumId={albumId}
          initialReview={userReview}
        />
      </Portal>
    </>
  );
};

AlbumReviews.propTypes = {
  albumId: PropTypes.number,
};

export default AlbumReviews;
