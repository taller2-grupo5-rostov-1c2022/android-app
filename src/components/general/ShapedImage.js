import React, { useState, useEffect } from "react";
import { useTheme } from "react-native-paper";
import PropTypes from "prop-types";
import { TouchableOpacity, Image, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export function ShapedImage({ onPress, imageUri, size, icon, shape, style }) {
  let theme = useTheme();
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [imageUri]);

  const imageStyle = {
    overflow: "hidden",
    width: size,
    height: size,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  };

  if (shape == "circle") imageStyle.borderRadius = size / 2;

  let showIcon = error || !imageUri;

  let image = (
    <>
      <Image
        style={[{ width: size, height: size }].concat(
          showIcon ? { display: "none" } : []
        )}
        source={{ uri: imageUri }}
        onError={(e) => {
          console.error("Failed to load image: ", e.nativeEvent.error);
          setError(true);
        }}
      />
      <Icon
        size={size / 2}
        name={error ? "help-rhombus" : icon}
        style={showIcon ? undefined : { display: "none" }}
      />
    </>
  );

  if (onPress)
    return (
      <TouchableOpacity style={[imageStyle, style]} onPress={onPress}>
        {image}
      </TouchableOpacity>
    );

  return <View style={[imageStyle, style]}>{image}</View>;
}

ShapedImage.propTypes = {
  onPress: PropTypes.func,
  imageUri: PropTypes.string,
  size: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
  shape: PropTypes.oneOf(["circle", "square"]).isRequired,
  style: PropTypes.any,
};
