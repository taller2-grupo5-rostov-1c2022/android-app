import React from "react";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import PropTypes from "prop-types";

function getIcon(sub_level) {
  if (sub_level === 0) return "currency-usd-off";
  if (sub_level === 1) return "star-outline";
  if (sub_level === 2) return "star";
  if (sub_level === 3) return "crown";
  return "file-question-outline";
}

const SubIcon = ({ sub_level, ...rest }) => {
  const theme = useTheme();
  if (sub_level >= 2) rest.color = theme.colors.primary;
  else if (!rest.color) rest.color = theme.colors.info;
  rest.style = rest.style ?? { marginRight: 5 };
  return <Icon name={getIcon(sub_level)} size={14} {...rest} />;
};

SubIcon.propTypes = {
  sub_level: PropTypes.number.isRequired,
};

export default SubIcon;
