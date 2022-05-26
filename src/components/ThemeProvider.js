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
import { Appearance, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "@theme";

export const ThemeContext = React.createContext({
  toggleTheme: () => {},
  isThemeDark: false,
});

async function getStoredTheme() {
  let stored = null;
  try {
    stored = await AsyncStorage.getItem(THEME_KEY);
  } catch (e) {
    console.error(e);
    toast.show("Failed to fetch theme setting");
  }

  if (stored) return JSON.parse(stored);

  const phoneThemeDark = Appearance.getColorScheme() == "dark";
  setStoragedTheme(phoneThemeDark);
  return phoneThemeDark;
}

async function setStoragedTheme(value) {
  try {
    await AsyncStorage.setItem(THEME_KEY, JSON.stringify(value));
  } catch (e) {
    toast.show("Failed to store theme setting");
  }
}

export default function ThemeProvider({ children }) {
  const [isThemeDark, setIsThemeDark] = React.useState(true);

  React.useEffect(() => {
    async function initialTheme() {
      const value = await getStoredTheme();
      setIsThemeDark(value);
    }
    initialTheme();
  }, []);

  let theme = isThemeDark ? DarkTheme : LightTheme;
  const toggleTheme = React.useCallback(() => {
    setStoragedTheme(!isThemeDark);
    setIsThemeDark(!isThemeDark);
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
          <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            {children}
          </View>
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
    info: "#555555",
  },
};
const DarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  roundness: 2,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    info: "#888888",
  },
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
