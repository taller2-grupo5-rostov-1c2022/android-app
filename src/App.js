import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Text,
  DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import LoginScreen from "./components/LoginScreen";

const Stack = createNativeStackNavigator();

const TextScreen = ({ navigation }) => {
  return <Text>Hola</Text>;
};

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
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="TextScreen" component={TextScreen} />
        </Stack.Navigator>
      </NavigationContainer>
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

//<Text>Songs: {isLoading ? "Loading" : JSON.stringify(data)}</Text>
/*
<NavigationContainer>
<Stack.Navigator initialRouteName="Login">
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="TextScreen" component={TextScreen} />
</Stack.Navigator>
</NavigationContainer>

*/