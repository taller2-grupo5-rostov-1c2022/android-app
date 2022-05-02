import { useEffect } from "react";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./login/LoginScreen";
import RegisterScreen from "./login/RegisterScreen";
import LoadingScreen from "./login/LoadingScreen";
import HomeScreen from "./HomeScreen";
import ManageMySongs from "./manageSongs/ManageMySongs";
("../config/firebase");
import { getAuth } from "firebase/auth";
import { StackActions } from "@react-navigation/native";

const StackNavigator = createNativeStackNavigator();
const navigation = createNavigationContainerRef();

function navigate(screenName) {
  // navigation won't be null as this is called after the
  // component has loaded (subscription starts on useEffect)
  navigation.dispatch(StackActions.replace(screenName));
}

function onAuthStateChanged(user) {
  if (!user) {
    navigate("Login");
    return;
  }

  let greet = "";
  if (user.displayName) greet = `Welcome back, ${user.displayName}!`;
  else greet = "Welcome to Spotifiuby!";
  toast.show(greet, {
    duration: 3000,
  });
  navigate("Home");
}

export default function Stack() {
  const auth = getAuth();

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return (
    <NavigationContainer ref={navigation}>
      <StackNavigator.Navigator
        initialRouteName="Loading"
        screenOptions={{ headerShown: false }}
      >
        <StackNavigator.Screen name="Loading" component={LoadingScreen} />
        <StackNavigator.Screen name="Login" component={LoginScreen} />
        <StackNavigator.Screen name="Home" component={HomeScreen} />
        <StackNavigator.Screen
          name="ManageMySongs"
          component={ManageMySongs}
          options={{ title: "Manage my songs", headerShown: true }}
        />
        <StackNavigator.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ title: "Create your account", headerShown: true }}
        />
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
}
