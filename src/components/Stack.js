import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import ManageMySongs from "./account/manageSongs/ManageMySongs";
import MyProfileScreen from "./account/profile/MyProfileScreen";
import AudioProvider from "./general/AudioProvider";
import ManageMyAlbums from "./account/manageAlbums/ManageMyAlbums";
import UserListScreen from "./account/users/UserListScreen";
import ManageMyPlaylists from "./account/managePlaylists/ManageMyPlaylists";
import ChatScreen from "./account/users/ChatScreen";
import { Portal } from "react-native-paper";
import NavigationAppbar from "./NavigationAppbar";
import LivesListScreen from "./lives/LivesListScreen";
import StreamProvider from "./lives/StreamProvider";
import ListeningLiveScreen from "./lives/ListeningLiveScreen";
import HostingLiveScreen from "./lives/HostingLiveScreen";
import Subscribe from "./account/subscriptions/Subscribe";
const StackNavigator = createNativeStackNavigator();

export default function Stack() {
  return (
    <AudioProvider>
      <StreamProvider>
        <Portal.Host>
          <StackNavigator.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: true,
              header: (props) => <NavigationAppbar {...props} />,
            }}
          >
            <StackNavigator.Screen name="Home" component={HomeScreen} />
            <StackNavigator.Screen
              name="ManageMySongs"
              component={ManageMySongs}
              options={{ title: "Manage my songs" }}
            />
            <StackNavigator.Screen
              name="MyProfileScreen"
              component={MyProfileScreen}
              options={{ title: "My Profile" }}
            />
            <StackNavigator.Screen
              name="ManageMyAlbums"
              component={ManageMyAlbums}
              options={{ title: "Manage my albums" }}
            />
            <StackNavigator.Screen
              name="ManageMyPlaylists"
              component={ManageMyPlaylists}
              options={{ title: "Manage my Playlists" }}
            />
            <StackNavigator.Screen
              name="ManageSubscription"
              component={Subscribe}
              options={{ title: "Manage Subscription" }}
            />
            <StackNavigator.Screen
              name="UserListScreen"
              component={UserListScreen}
              options={{ title: "Other users" }}
            />
            <StackNavigator.Screen name="ChatScreen" component={ChatScreen} />
            <StackNavigator.Screen
              name="LivesListScreen"
              component={LivesListScreen}
              options={{ title: "Live streams" }}
            />
            <StackNavigator.Screen
              name="ListeningLiveScreen"
              component={ListeningLiveScreen}
              options={{ title: "Listening to a Live Stream" }}
            />
            <StackNavigator.Screen
              name="HostingLiveScreen"
              component={HostingLiveScreen}
              options={{ title: "Hosting a Live Stream" }}
            />
          </StackNavigator.Navigator>
        </Portal.Host>
      </StreamProvider>
    </AudioProvider>
  );
}
