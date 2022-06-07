import React from "react";
import { Appbar } from "react-native-paper";
import PropTypes from "prop-types";

export default function NavigationAppbar({ navigation, back, options }) {
  if (!options.headerShown) return null;

  return (
    <Appbar>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={options.title} />
    </Appbar>
  );
}

NavigationAppbar.propTypes = {
  back: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  options: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    headerShown: PropTypes.bool,
  }),
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
