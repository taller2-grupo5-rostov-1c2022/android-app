import React, { useState, useMemo, useEffect } from "react";
import { useTheme } from "react-native-paper";
import PropTypes from "prop-types";
import { TouchableOpacity, Image, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export function ShapedImage({ onPress, imageUri, size, icon, shape, style }) {
  let theme = useTheme();
  const [error, setError] = useState(false);

  const imageIcon = useMemo(() => {
    return <Icon size={size / 2} name={error ? "help-rhombus" : icon} />;
  }, [icon, size, error]);

  useEffect(() => {
    setError(false);
  }, [imageUri]);

  let avatar = null;
  if (!imageUri || error) avatar = imageIcon;
  else
    avatar = (
      <Image
        style={{ width: size, height: size }}
        source={{ uri: imageUri }}
        onError={(e) => {
          console.error(e.nativeEvent.error);
          setError(true);
          toast.show("An image could not be loaded", {
            duration: 3000,
          });
        }}
      />
    );

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

  if (onPress)
    return (
      <TouchableOpacity style={[imageStyle, style]} onPress={onPress}>
        {avatar}
      </TouchableOpacity>
    );
  else return <View style={[imageStyle, style]}>{avatar}</View>;
}

ShapedImage.propTypes = {
  onPress: PropTypes.func,
  imageUri: PropTypes.string,
  size: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
  shape: PropTypes.oneOf(["circle", "square"]).isRequired,
  style: PropTypes.any,
};
