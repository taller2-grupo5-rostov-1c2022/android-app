import React from "react";
import { useTheme } from "react-native-paper";
import PropTypes from "prop-types";
import { TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// sha
export function ShapedImage({ onPress, imageUri, size, icon, shape, style }) {
  let avatar = null;
  let theme = useTheme();
  if (imageUri)
    avatar = (
      <Image style={{ width: size, height: size }} source={{ uri: imageUri }} />
    );
  else avatar = <Icon size={size / 2} name={icon} />;

  const imageStyle = {
    overflow: "hidden",
    width: size,
    height: size,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  };

  if (shape == "circle") imageStyle.borderRadius = size / 2;

  return (
    <TouchableOpacity style={[imageStyle, style]} onPress={onPress}>
      {avatar}
    </TouchableOpacity>
  );
}

ShapedImage.propTypes = {
  onPress: PropTypes.func,
  imageUri: PropTypes.string,
  size: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
  shape: PropTypes.oneOf(["circle", "square"]).isRequired,
  style: PropTypes.any,
};
