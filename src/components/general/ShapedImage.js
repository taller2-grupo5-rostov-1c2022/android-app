import React from "react";
import { useTheme } from "react-native-paper";
import PropTypes from "prop-types";
import { TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// sha
export function ShapedImage({ onPress, imageUri, size, icon, shape }) {
  let avatar = null;
  let theme = useTheme();
  //console.log(imageUri);
  if (imageUri)
    avatar = (
      <Image style={{ width: size, height: size }} source={{ uri: imageUri }} />
    );
  else avatar = <Icon size={size / 2} name={icon} />;

  const style = {
    overflow: "hidden",
    width: size,
    height: size,
    borderRadius: shape == "circle" ? size / 2 : size,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  };

  return (
    <TouchableOpacity style={style} onPress={onPress}>
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
};
