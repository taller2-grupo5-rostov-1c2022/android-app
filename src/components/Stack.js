import { useEffect, useState } from "react";
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
import UserCreationScreen from "./account/userCreation/UserCreationScreen";
import appContext from "./appContext";
import ManageMyAlbums from "./account/manageAlbums/ManageMyAlbums";

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
  navigate("UserCreation");
}

export default function Stack() {
  const auth = getAuth();

  const [song, setSong] = useState("");
  const [stop, setStop] = useState(false);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return (
    <appContext.Provider
      value={{ song, stop, queue, setSong, setStop, setQueue }}
    >
      <NavigationContainer ref={navigation}>
        <StackNavigator.Navigator
          initialRouteName="Loading"
          screenOptions={{ headerShown: false }}
        >
          <StackNavigator.Screen name="Loading" component={LoadingScreen} />
          <StackNavigator.Screen name="Login" component={LoginScreen} />
          <StackNavigator.Screen name="Home" component={HomeScreen} />
          <StackNavigator.Screen
            name="UserCreation"
            component={UserCreationScreen}
          />
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
          <StackNavigator.Screen
            name="ManageMyAlbums"
            component={ManageMyAlbums}
            options={{ title: "Manage my albums", headerShown: true }}
          />
        </StackNavigator.Navigator>
      </NavigationContainer>
    </appContext.Provider>
  );
}
