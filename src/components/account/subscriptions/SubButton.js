import React from "react";
import { TouchableOpacity } from "react-native";
import { Text, useTheme } from "react-native-paper";
import PropTypes from "prop-types";
import SubIcon from "../../general/SubIcon";
import styles from "../../styles";

const SubButton = ({ sub, ...rest }) => {
  const theme = useTheme();
  return (
    <>
      <Text style={{ color: theme.colors.text }}>{sub?.name}</Text>
    </>
  );
};

export default SubButton;

SubButton.propTypes = {
  sub: PropTypes.shape({
    level: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};
