import React, { memo } from "react";
import PropTypes from "prop-types";
import { List, useTheme } from "react-native-paper";
import { getArtistsAsString } from "../../util/general";

function SongItem({ data, right, playing, ...rest }) {
  const theme = useTheme();
  return (
    <List.Item
      title={data?.name}
      description={getArtistsAsString(data?.artists)}
      right={right}
      titleStyle={
        playing
          ? { color: theme.colors.primary, fontWeight: "bold" }
          : undefined
      }
      {...rest}
    />
  );
}

export default memo(SongItem);

SongItem.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    artists: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired
    ),
    id: PropTypes.number,
  }),
  playing: PropTypes.bool,
  right: PropTypes.func,
  onPress: PropTypes.func,
};
