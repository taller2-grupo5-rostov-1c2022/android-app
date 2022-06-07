import React from "react";
import { Appbar, useTheme } from "react-native-paper";
import { StatusBar } from "react-native";
import PropTypes from "prop-types";

export default function NavigationAppbar({ navigation, back, options }) {
  const theme = useTheme();
  if (!options.headerShown) return null;

  return (
    <>
      <Appbar.Header statusBarHeight={0}>
        {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
        {options.left}
        <Appbar.Content title={options.title} />
        {options.right}
      </Appbar.Header>
      <StatusBar
        backgroundColor={
          theme.dark ? theme.colors.surface : theme.colors.primary
        }
      />
    </>
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
    left: PropTypes.any,
    right: PropTypes.any,
  }),
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
