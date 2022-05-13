import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "./account/login/RegisterScreen";
import HomeScreen from "./HomeScreen";
import ManageMySongs from "./account/manageSongs/ManageMySongs";
import MyProfileScreen from "./account/profile/MyProfileScreen";
import SessionManager from "./account/profile/SessionManager";
import appContext from "./appContext";
import ManageMyAlbums from "./account/manageAlbums/ManageMyAlbums";

const StackNavigator = createNativeStackNavigator();

export default function Stack() {
  const [song, setSong] = useState("");
  const [stop, setStop] = useState(false);
  const [queue, setQueue] = useState([]);

  return (
    <appContext.Provider
      value={{ song, stop, queue, setSong, setStop, setQueue }}
    >
      <NavigationContainer>
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
