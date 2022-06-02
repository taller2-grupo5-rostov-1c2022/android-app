import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import ManageMySongs from "./account/manageSongs/ManageMySongs";
import MyProfileScreen from "./account/profile/MyProfileScreen";
import AudioProvider from "./general/AudioProvider";
import ManageMyAlbums from "./account/manageAlbums/ManageMyAlbums";
import UserListScreen from "./account/users/UserListScreen";
import { Portal } from "react-native-paper";
import ManageMyPlaylists from "./account/managePlaylists/ManageMyPlaylists";
import ChatScreen from "./account/users/ChatScreen";

const StackNavigator = createNativeStackNavigator();

export default function Stack() {
  return (
    <AudioProvider>
      <Portal.Host>
        <StackNavigator.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <StackNavigator.Screen name="Home" component={HomeScreen} />
          <StackNavigator.Screen
            name="ManageMySongs"
            component={ManageMySongs}
            options={{ title: "Manage my songs", headerShown: true }}
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
          <StackNavigator.Screen
            name="UserListScreen"
            component={UserListScreen}
            options={{ title: "Other users", headerShown: true }}
          />
          <StackNavigator.Screen name="ChatScreen" component={ChatScreen} />
        </StackNavigator.Navigator>
      </Portal.Host>
    </AudioProvider>
  );
}
