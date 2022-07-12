import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import PropTypes from "prop-types";

const STARS = 3;

function getIcon(i, subLevel) {
  return i <= subLevel ? "music-note" : "music-note-outline";
}

const SubIcon = ({ subLevel, ...rest }) => {
  const theme = useTheme();
  if (!rest.color) rest.color = theme.colors.info;

  //if (subLevel === 0) rest.style = [{ opacity: 0 }].concat(rest.style ?? []);

  const icons = [];
  for (let i = 1; i <= STARS; i++) {
    icons.push(
      <Icon key={i} size={16} name={getIcon(i, subLevel)} {...rest} />
    );
  }

  return <View>{icons}</View>;
};

SubIcon.propTypes = {
  subLevel: PropTypes.number.isRequired,
};

export default SubIcon;
