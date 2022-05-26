import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../account/login/RegisterScreen";
import ForgotPasswordScreen from "../account/login/ForgotPasswordScreen";
import LoginScreen from "../account/login/LoginScreen";
const StackNavigator = createNativeStackNavigator();

export default function LoginStack() {
  return (
    <StackNavigator.Navigator
      initialRouteName="SessionManager"
      screenOptions={{ headerShown: false }}
    >
      <StackNavigator.Screen name="LoginScreen" component={LoginScreen} />
      <StackNavigator.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ title: "Create your account", headerShown: true }}
      />
      <StackNavigator.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{ title: "Reset you password", headerShown: true }}
      />
    </StackNavigator.Navigator>
  );
}
