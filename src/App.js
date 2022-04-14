import React, { useEffect, useState } from "react";

import {
  Text,
  DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import LoginScreen from "./components/LoginScreen";

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const response = await fetch(
        "https://rostov-gateway.herokuapp.com/songs/"
      );
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <LoginScreen />
      <Text>Songs: {isLoading ? "Loading" : JSON.stringify(data)}</Text>
    </PaperProvider>
  );
}

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3498db",
    accent: "#f1c40f",
  },
};
