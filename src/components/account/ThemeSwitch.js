import React from "react";
import { ThemeContext } from "../ThemeProvider";
import { List } from "react-native-paper";

export default function ThemeSwitch() {
  const { toggleTheme, isThemeDark } = React.useContext(ThemeContext);
  return (
    <List.Section>
      <List.Subheader>App Theme</List.Subheader>
      <List.Item
        title={isThemeDark ? "Dark" : "Light"}
        onPress={toggleTheme}
        left={(props) => (
          <List.Icon
            {...props}
            icon={isThemeDark ? "moon-waning-crescent" : "weather-sunny"}
          ></List.Icon>
        )}
      />
    </List.Section>
  );
}
