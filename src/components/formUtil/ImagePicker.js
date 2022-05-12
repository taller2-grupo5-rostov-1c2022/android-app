import React, { useState } from "react";
import { Text } from "react-native-paper";
import PropTypes from "prop-types";
import styles from "../styles";
import { View } from "react-native";
import FilePicker from "./FilePicker";
import { UserImage } from "../general/RoundedImage";

export default function UserImagePicker({ customProps, ...rest }) {
  const { initialImageUri } = customProps;
  const [status, setStatus] = useState(null);

  return (
    <View>
      <FilePicker
        {...rest}
        customProps={{
          fileType: "image/*",
          setStatus,
          button: (
            <UserImage
              size={200}
              imageUri={status?.uri ?? initialImageUri}
              icon="account"
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

UserImagePicker.propTypes = {
  customProps: PropTypes.shape({
    initialImageUri: PropTypes.string.isRequired,
  }).isRequired,
};
