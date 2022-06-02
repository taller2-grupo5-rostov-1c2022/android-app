import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { IconButton, Subheading, useTheme } from "react-native-paper";
import { ShapedImage } from "../../general/ShapedImage";
import styles from "../../styles";

export default function ChatHeader({ user, navigation }) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          alignItems: "center",
          backgroundColor: theme.colors.surface,
          paddingVertical: 6,
        },
      ]}
    >
      <IconButton icon="arrow-left" onPress={navigation.goBack} />
      <ShapedImage
        shape="circle"
        size={40}
        icon="account"
        imageUri={user.pfp}
        style={{ marginRight: "5%" }}
      />
      <Subheading>{user.name}</Subheading>
    </View>
  );
}

ChatHeader.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    pfp: PropTypes.string,
  }).isRequired,
  navigation: PropTypes.shape({
    setOptions: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
