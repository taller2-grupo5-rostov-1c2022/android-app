import React, { useEffect } from "react";
import { useTheme } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackActions, useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
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
import LivesListScreen from "./streamings/LivesListScreen";
import ListeningLiveScreen from "./streamings/ListeningLiveScreen";
import HostingLiveScreen from "./streamings/HostingLiveScreen";
import NotificationListScreen from "./notifications/NotificationListScreen";
import NotificationProvider from "./notifications/NotificationProvider";
import ManageSubscription from "./account/subscriptions/ManageSubscription";
import FavoritesScreen from "./favorites/FavoritesScreen";

const StackNavigator = createNativeStackNavigator();

export default function Stack() {
  const notification = Notifications.useLastNotificationResponse();
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    const type = notification?.notification?.request?.content?.data?.type;
    if (type == "message")
      navigation.dispatch({
        ...StackActions.push("ChatScreen", {
          id: notification?.notification?.request?.content?.data?.sender_uid,
        }),
      });
  }, [notification]);

  return (
    <AudioProvider>
      <NotificationProvider>
        <Portal.Host>
          <StackNavigator.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: true,
              header: (props) => <NavigationAppbar {...props} />,
              contentStyle: {
                backgroundColor: theme.colors.background,
              },
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
              component={ManageSubscription}
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
            <StackNavigator.Screen
              name="NotificationListScreen"
              component={NotificationListScreen}
              options={{ title: "Notifications" }}
            />
            <StackNavigator.Screen
              name="FavoritesScreen"
              component={FavoritesScreen}
              options={{ title: "Favorites" }}
            />
          </StackNavigator.Navigator>
        </Portal.Host>
      </NotificationProvider>
    </AudioProvider>
  );
}
