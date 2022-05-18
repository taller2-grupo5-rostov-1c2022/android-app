import React from "react";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import PropTypes from "prop-types";
import { Appearance } from "react-native";

export const ThemeContext = React.createContext({
  toggleTheme: () => {},
  isThemeDark: false,
});

function getDefaultIsThemeDark() {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme == "dark";
}

export default function ThemeProvider({ children }) {
  const [isThemeDark, setIsThemeDark] = React.useState(getDefaultIsThemeDark());

  let theme = isThemeDark ? DarkTheme : LightTheme;

  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark]
  );

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <ThemeContext.Provider value={preferences}>
          {children}
        </ThemeContext.Provider>
      </NavigationContainer>
    </PaperProvider>
  );
}

const LightTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  roundness: 2,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: "#3498db",
    accent: "#f1c40f",
    modal: "white",
  },
};
const DarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  roundness: 2,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    modal: "#181818",
  },
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
