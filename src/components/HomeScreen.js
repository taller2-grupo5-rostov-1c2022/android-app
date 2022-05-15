import { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import SongsScreen from "./songs/SongsScreen";
import AccountScreen from "./account/AccountScreen.js";
import PropTypes from "prop-types";
import AlbumsScreen from "./albums/AlbumsScreen";

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "music", title: "Music", icon: "music-note" },
    { key: "albums", title: "Albums", icon: "album" },
    { key: "account", title: "Account", icon: "account" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    music: SongsScreen,
    albums: AlbumsScreen,
    account: AccountScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
