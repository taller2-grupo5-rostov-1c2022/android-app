import React, {
  useEffect,
  createContext,
  useState,
  useMemo,
  useCallback,
} from "react";
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
import { StatusBar } from "react-native";
import { setBackgroundColorAsync } from "expo-system-ui";

const THEME_KEY = "@theme";

export const ThemeContext = createContext({
  toggleTheme: () => {},
  isThemeDark: false,
  reset: () => {},
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

async function initialTheme(setIsThemeDark) {
  const value = await getStoredTheme();
  setIsThemeDark(value);
}

export default function ThemeProvider({ children }) {
  const [isThemeDark, setIsThemeDark] = useState(true);

  useEffect(() => {
    initialTheme(setIsThemeDark);
  }, []);

  let theme = isThemeDark ? DarkTheme : LightTheme;
  const toggleTheme = useCallback(() => {
    setStoragedTheme(!isThemeDark);
    setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  useEffect(() => {
    let theme = isThemeDark ? DarkTheme : LightTheme;
    setBackgroundColorAsync(theme.colors.background).catch(console.log);
  }, [isThemeDark]);

  const preferences = useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
      reset: () => {
        initialTheme(setIsThemeDark).catch();
      },
    }),
    [toggleTheme, isThemeDark, setIsThemeDark]
  );

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <ThemeContext.Provider value={preferences}>
          <StatusBar
            backgroundColor={
              theme.dark ? theme.colors.surface : theme.colors.primary
            }
          />
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
