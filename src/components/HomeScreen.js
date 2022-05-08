import React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import SongsScreen from "./SongsScreen";
import AccountScreen from "./account/AccountScreen.js";
import PropTypes from "prop-types";
import styles from "./styles.js";
import ExternalView from "./ExternalView";
import Player from "./Player";
import appContext from "./appContext";

const AlbumsScreen = () => {
  return (
    <ExternalView style={styles.container}>
      <Text> TODO </Text>
      <Player />
    </ExternalView>
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

  const [name, setName] = React.useState("");
  const [artist, setArtist] = React.useState("");
  const [songUrl, setSongUrl] = React.useState("");

  return (
    <appContext.Provider
      value={{ name, artist, songUrl, setName, setArtist, setSongUrl }}
    >
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
