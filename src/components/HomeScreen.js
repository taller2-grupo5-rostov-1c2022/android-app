import React, { useState } from "react";
import { View } from "react-native";
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

  const renderScene = BottomNavigation.SceneMap({
    music: SongsScreen,
    albums: AlbumsScreen,
    playlists: PlayListScreen,
    account: AccountScreen,
  });

  return (
    <View style={{ flex: 1 }}>
      <Appbar>
        <Appbar.Content title={routes[index].title} />
        <Appbar.Action
          icon="antenna"
          onPress={() => navigation.push("LiveScreen")}
        />
      </Appbar>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        shifting={false}
      />
    </View>
  );
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
