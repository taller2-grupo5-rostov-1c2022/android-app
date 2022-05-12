import React, { useState } from "react";
import { Text } from "react-native-paper";
import PropTypes from "prop-types";
import styles from "../styles";
import { View } from "react-native";
import FilePicker from "../formUtil/FilePicker";
import { UserImage } from "./UserImage";

export default function UserImagePicker({ customProps, ...rest }) {
  const { initialImage } = customProps;
  const [status, setStatus] = useState(null);

  return (
    <View>
      <FilePicker
        {...rest}
        customProps={{
          fileType: "image/*",
          setStatus,
          button: <UserImage size={200} image={status?.file ?? initialImage} />,
        }}
      />
      <Text style={[styles.errorText, { textAlign: "center" }]}>
        {status?.error}
      </Text>
    </View>
  );
}

UserImagePicker.propTypes = {
  customProps: PropTypes.shape({
    initialImage: PropTypes.shape({
      uri: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
