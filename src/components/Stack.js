import React, { lazy, Suspense } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import ManageMySongs from "./account/manageSongs/ManageMySongs";
import MyProfileScreen from "./account/profile/MyProfileScreen";
import AudioProvider from "./general/AudioProvider";
import ManageMyAlbums from "./account/manageAlbums/ManageMyAlbums";
import UserListScreen from "./account/users/UserListScreen";
import ManageMyPlaylists from "./account/managePlaylists/ManageMyPlaylists";
import ChatScreen from "./account/users/ChatScreen";
import { View } from "react-native";
import { Portal, Text, ActivityIndicator } from "react-native-paper";
import styles from "./styles.js";
import Constants from "expo-constants";

const StackNavigator = createNativeStackNavigator();

const liveSupported =
  Constants.appOwnership != "expo" && !Constants?.platform?.web;

const LiveStreamScreen = liveSupported
  ? lazy(() => import("./lives/LiveStream"))
  : () => (
      <View style={[styles.container, styles.containerCenter]}>
        <Text>Live streams are not supported on Expo Go or Web</Text>
      </View>
    );

export default function Stack() {
  return (
    <AudioProvider>
      <Portal.Host>
        <Suspense
          fallback={<ActivityIndicator style={styles.activityIndicator} />}
        >
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
            <StackNavigator.Screen
              name="LiveScreen"
              component={LiveStreamScreen}
              options={{ title: "Live streams", headerShown: true }}
            />
          </StackNavigator.Navigator>
        </Suspense>
      </Portal.Host>
    </AudioProvider>
  );
}
