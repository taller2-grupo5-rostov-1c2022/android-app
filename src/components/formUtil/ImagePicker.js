import React, { useState } from "react";
import { Text } from "react-native-paper";
import PropTypes from "prop-types";
import styles from "../styles";
import { View } from "react-native";
import FilePicker from "./FilePicker";
import { ShapedImage } from "../general/ShapedImage";

export default function ImagePicker({ customProps, ...rest }) {
  const { initialImageUri, ...customRest } = customProps;
  const [status, setStatus] = useState(null);

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
        }}
      />
      <Text style={[styles.errorText, { textAlign: "center" }]}>
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
  }).isRequired,
};
