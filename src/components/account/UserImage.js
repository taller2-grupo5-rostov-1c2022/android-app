import React from "react";
import { Avatar } from "react-native-paper";
import PropTypes from "prop-types";
import { TouchableOpacity, Image, View } from "react-native";

export function UserImage({ onPress, image, size }) {
  let avatar = null;

  if (image)
    avatar = (
      <View
        style={{
          overflow: "hidden",
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      >
        <Image style={{ width: size, height: size }} source={image} />
      </View>
    );
  else avatar = <Avatar.Icon size={size} icon="account" />;

  if (onPress)
    return <TouchableOpacity onPress={onPress}>{avatar}</TouchableOpacity>;
  return avatar;
}

UserImage.propTypes = {
  onPress: PropTypes.func,
  image: PropTypes.shape({
    uri: PropTypes.string.isRequired,
  }),
  size: PropTypes.number,
};
