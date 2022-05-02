import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./login/LoginScreen";
import RegisterScreen from "./login/RegisterScreen";
import HomeScreen from "./HomeScreen";
import ManageMySongs from "./manageSongs/ManageMySongs";
("../config/firebase");

const StackNavigator = createNativeStackNavigator();

export default function Stack() {
  return (
    <NavigationContainer>
      <StackNavigator.Navigator initialRouteName="Login">
        <StackNavigator.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <StackNavigator.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <StackNavigator.Screen
          name="ManageMySongs"
          component={ManageMySongs}
          options={{ title: "Manage my songs" }}
        />
        <StackNavigator.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ title: "Create your account" }}
        />
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
}
