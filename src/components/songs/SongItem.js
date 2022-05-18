import React from "react";
import PropTypes from "prop-types";
import { List } from "react-native-paper";
import { getArtistsAsString } from "../../util/general";

export default function SongItem({ data, right, onPress }) {
  return (
    <List.Item
      title={data.name}
      description={getArtistsAsString(data.artists)}
      right={right}
      onPress={onPress ? () => onPress(data) : undefined}
    />
  );
}

SongItem.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    artists: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired
    ),
  }).isRequired,
  right: PropTypes.func,
  onPress: PropTypes.func,
};