import React, { useState, useEffect } from "react";
import { BottomNavigation, Appbar } from "react-native-paper";
import SongsScreen from "./songs/SongsScreen";
import AccountScreen from "./account/AccountScreen.js";
import PropTypes from "prop-types";
import AlbumsScreen from "./albums/AlbumsScreen";
import PlayListScreen from "./playlists/PlayListScreen";

export default function HomeScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "music", title: "Music", icon: "music-note" },
    { key: "albums", title: "Albums", icon: "album" },
    { key: "playlists", title: "Playlists", icon: "playlist-music" },
    { key: "account", title: "More", icon: "menu" },
  ]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: routes[index].title,
      right: (
        <Appbar.Action
          icon="antenna"
          onPress={() => navigation.push("LivesListScreen")}
        />
      ),
    });
  }, [index]);

  const renderScene = BottomNavigation.SceneMap({
    music: SongsScreen,
    albums: AlbumsScreen,
    playlists: PlayListScreen,
    account: AccountScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      shifting={false}
    />
  );
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
  }).isRequired,
};
