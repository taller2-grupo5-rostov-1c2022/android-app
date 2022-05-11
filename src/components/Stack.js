import { useEffect } from "react";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./account/login/LoginScreen";
import RegisterScreen from "./account/login/RegisterScreen";
import LoadingScreen from "./account/login/LoadingScreen";
import HomeScreen from "./HomeScreen";
import ManageMySongs from "./account/manageSongs/ManageMySongs";
import { getAuth } from "firebase/auth";
import { StackActions } from "@react-navigation/native";
import MyProfileScreen from "./account/MyProfileScreen";

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
        <StackNavigator.Screen
          name="MyProfileScreen"
          component={MyProfileScreen}
          options={{ title: "My Profile", headerShown: true }}
        />
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
}
