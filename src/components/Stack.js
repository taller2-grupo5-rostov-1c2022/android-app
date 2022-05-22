import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "./account/login/RegisterScreen";
import HomeScreen from "./HomeScreen";
import ManageMySongs from "./account/manageSongs/ManageMySongs";
import MyProfileScreen from "./account/profile/MyProfileScreen";
import SessionManager from "./account/profile/SessionManager";
import AudioProvider from "./general/AudioProvider";
import ManageMyAlbums from "./account/manageAlbums/ManageMyAlbums";
import ForgotPasswordScreen from "./account/login/ForgotPasswordScreen";
import UserListScreen from "./account/users/UserListScreen";
import { Portal, useTheme } from "react-native-paper";
import { View } from "react-native";
import ManageMyPlaylists from "./account/managePlaylists/ManageMyPlaylists";
const StackNavigator = createNativeStackNavigator();

export default function Stack() {
  const theme = useTheme();

  return (
    <AudioProvider>
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
            <StackNavigator.Screen
              name="UserListScreen"
              component={UserListScreen}
              options={{ title: "Other users", headerShown: true }}
            />
          </StackNavigator.Navigator>
        </Portal.Host>
      </View>
    </AudioProvider>
  );
}
