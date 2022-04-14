import React from "react";
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import LoginScreen from './components/LoginScreen'

export default function App() {

  return (
    <PaperProvider theme={theme}>
      <LoginScreen/>
    </PaperProvider>
  );
}

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};
