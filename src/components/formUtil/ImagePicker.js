import React, { useState } from "react";
import { Text } from "react-native-paper";
import PropTypes from "prop-types";
import { View } from "react-native";
import FilePicker from "./FilePicker";
import { ShapedImage } from "../general/ShapedImage";
import { useTheme } from "react-native-paper";

export default function ImagePicker({ customProps, ...rest }) {
  const { initialImageUri, error, ...customRest } = customProps;
  const [status, setStatus] = useState(null);
  let theme = useTheme();

  return (
    <View>
      <FilePicker
        {...rest}
        customProps={{
          fileType: "image/*",
          setStatus,
          button: (
            <ShapedImage
              imageUri={status?.uri ?? initialImageUri}
              {...customRest}
            />
          ),
          error,
        }}
      />
      <Text style={{ textAlign: "center", color: theme.colors.error }}>
        {status?.error}
      </Text>
    </View>
  );
}

ImagePicker.propTypes = {
  customProps: PropTypes.shape({
    initialImageUri: PropTypes.string.isRequired,
    shape: PropTypes.oneOf(["circle", "square"]).isRequired,
    icon: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    styles: PropTypes.any,
    error: PropTypes.any,
  }).isRequired,
};
