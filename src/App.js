import { StatusBar } from "expo-status-bar";
import React from "react";
import { DefaultTheme, Text, Headline, Button, TextInput, Provider as PaperProvider } from 'react-native-paper';
import { StyleSheet, Image, SafeAreaView} from "react-native";

export default function App() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <Image source={require('./img/logo.png')} />
        <Headline>Spotifiuby</Headline>
        <Text>Log In</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          secureTextEntry={true}
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
        />
        <Button mode="contained">Log In</Button>
        <StatusBar style="auto" />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%"
  }
});

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};