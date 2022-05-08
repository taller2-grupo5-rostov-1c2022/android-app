import React from "react";
import { Avatar } from "react-native-paper";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";

export function UserImage({ onPress, url, size }) {
  const image = url ? { uri: url } : null;
  let avatar = null;

  if (image) avatar = <Avatar.Image size={size} source={image} />;
  else avatar = <Avatar.Icon size={size} icon="account" />;

  if (onPress)
    return <TouchableOpacity onPress={onPress}>{avatar}</TouchableOpacity>;
  return avatar;
}

UserImage.propTypes = {
  onPress: PropTypes.func,
  url: PropTypes.string,
  size: PropTypes.number,
};
