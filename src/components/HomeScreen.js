import React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import SongsScreen from "./SongsScreen";
import AccountScreen from "./account/AccountScreen.js";
import PropTypes from "prop-types";
import styles from "./styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import Player from "./Player";
import appContext from "./appContext";

const AlbumsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text> TODO </Text>
      <Player />
    </SafeAreaView>
  );
};

export default function HomeScreen() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "music", title: "Music", icon: "music-note" },
    { key: "albums", title: "Albums", icon: "album" },
    { key: "account", title: "Account", icon: "account" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    music: SongsScreen,
    albums: AlbumsScreen,
    account: AccountScreen,
  });

  const [song, setSong] = React.useState("");
  const [stop, setStop] = React.useState(false);
  const [queue, setQueue] = React.useState([]);

  return (
    <appContext.Provider value={{ song, stop, queue, setSong, setStop, setQueue }}>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </appContext.Provider>
  );
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
