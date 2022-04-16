import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, Headline, Button, TextInput } from 'react-native-paper';
import { StyleSheet, Image, SafeAreaView} from "react-native";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    return (
      <SafeAreaView style={styles.container}>
        <Image source={require('../img/logo.png')} />
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
        <Button
        onPress={() =>
          navigation.navigate('TextScreen')
        }
         mode="contained">Log In</Button>
        <StatusBar style="auto" />
      </SafeAreaView>
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

export default LoginScreen;