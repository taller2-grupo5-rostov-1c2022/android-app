import React from "react";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import PropTypes from "prop-types";

function getIcon(subLevel) {
  if (subLevel === 0) return "currency-usd-off";
  if (subLevel === 1) return "star-outline";
  if (subLevel === 2) return "star";
  if (subLevel === 3) return "crown";
  return "file-question-outline";
}

const SubIcon = ({ subLevel, ...rest }) => {
  const theme = useTheme();
  if (subLevel >= 2) rest.color = theme.colors.primary;
  else if (!rest.color) rest.color = theme.colors.info;
  rest.style = rest.style ?? { marginRight: 5 };
  return <Icon name={getIcon(subLevel)} size={14} {...rest} />;
};

SubIcon.propTypes = {
  subLevel: PropTypes.number.isRequired,
};

export default SubIcon;
