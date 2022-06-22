import React from "react";
import { IconButton, useTheme } from "react-native-paper";
import PropTypes from "prop-types";

export default function LikeIcon({ liked, onPress, ...rest }) {
  const theme  = useTheme();
  return (
    <IconButton
      {...rest}
      icon={liked ? "heart" : "heart-outline"}
      onPress={onPress}
      color={liked ? theme.colors.primary : rest.color}
    />
  );
}

LikeIcon.propTypes = {
  liked: PropTypes.bool,
  onPress: PropTypes.func,
};
