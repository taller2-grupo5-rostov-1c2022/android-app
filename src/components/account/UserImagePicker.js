import React, { useState } from "react";
import { Avatar } from "react-native-paper";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";
import styles from "../styles";
import { Text } from "react-native-paper";
import { View } from "react-native";
import FilePicker from "../formUtil/FilePicker";

export default function UserImagePicker({ customProps, ...rest }) {
  const { initialImage } = customProps;
  const [status, setStatus] = useState(null);
  let avatar = null;

  if (initialImage || status?.file)
    avatar = <Avatar.Image size={200} source={status?.file ?? initialImage} />;
  else avatar = <Avatar.Icon size={200} icon="account" />;

  return (
    <View>
      <FilePicker
        {...rest}
        customProps={{
          fileType: "image/*",
          setStatus,
          button: <TouchableOpacity>{avatar}</TouchableOpacity>,
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
    initialImage: PropTypes.any,
  }).isRequired,
};
