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
import AudioController from "./general/AudioController";
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
  navigate("UserCreation");
}

export default function Stack() {
  const auth = getAuth();

  const [song, setSong] = useState("");
  const [paused, setPaused] = useState(false);
  const [stop, setStop] = useState(false);
  const [previous, setPrevious] = useState(false);
  const [next, setNext] = useState(false);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return (
    <appContext.Provider
      value={{ song, paused, stop, queue, previous, next,
      setSong, setPaused, setStop, setQueue, setPrevious, setNext }}
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
      <AudioController/>
    </appContext.Provider>
  );
}
