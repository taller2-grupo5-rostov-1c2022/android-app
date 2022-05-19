import { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "./account/login/RegisterScreen";
import HomeScreen from "./HomeScreen";
import ManageMySongs from "./account/manageSongs/ManageMySongs";
import MyProfileScreen from "./account/profile/MyProfileScreen";
import SessionManager from "./account/profile/SessionManager";
import AppContext from "./AppContext";
import AudioController from "./general/AudioController";
import ManageMyAlbums from "./account/manageAlbums/ManageMyAlbums";
import ForgotPasswordScreen from "./account/login/ForgotPasswordScreen";
import { Portal, useTheme } from "react-native-paper";
import { View } from "react-native";
import ManageMyPlaylists from "./playlists/ManageMyPlaylists";

const StackNavigator = createNativeStackNavigator();

export default function Stack() {
  const [song, setSong] = useState("");
  const [paused, setPaused] = useState(false);
  const [stop, setStop] = useState(false);
  const [previous, setPrevious] = useState(false);
  const [next, setNext] = useState(false);
  const [queue, setQueue] = useState([]);
  const theme = useTheme();

  return (
    <AppContext.Provider
      value={{
        song,
        paused,
        stop,
        queue,
        previous,
        next,
        setSong,
        setPaused,
        setStop,
        setQueue,
        setPrevious,
        setNext,
      }}
    >
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Portal.Host>
          <StackNavigator.Navigator
            initialRouteName="SessionManager"
            screenOptions={{ headerShown: false }}
          >
            <StackNavigator.Screen name="Home" component={HomeScreen} />
            <StackNavigator.Screen
              name="SessionManager"
              component={SessionManager}
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
              name="ForgotPasswordScreen"
              component={ForgotPasswordScreen}
              options={{ title: "Reset you password", headerShown: true }}
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
            <StackNavigator.Screen
              name="ManageMyPlaylists"
              component={ManageMyPlaylists}
              options={{ title: "Manage my Playlists", headerShown: true }}
            />
          </StackNavigator.Navigator>
          <AudioController />
        </Portal.Host>
      </View>
    </AppContext.Provider>
  );
}
