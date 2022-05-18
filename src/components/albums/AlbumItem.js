import React from "react";
import PropTypes from "prop-types";
import { List } from "react-native-paper";
import { ShapedImage } from "../general/ShapedImage";

export default function AlbumItem({ data, onPress }) {
  return (
    <List.Item
      title={data.name}
      description={data.genre}
      onPress={onPress ? () => onPress(data) : undefined}
      left={() => (
        <ShapedImage
          icon="album"
          size={50}
          shape="square"
          imageUri={data.cover}
          style={{ marginRight: 10 }}
        />
      )}
    />
  );
}

AlbumItem.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    genre: PropTypes.string,
    cover: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func,
};
