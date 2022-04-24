import React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import SongsScreen from "./SongsScreen";
import AccountScreen from "./AccountScreen.js";
import PropTypes from "prop-types";
import styles from "./styles.js";
import ExternalView from "./ExternalView";

const AlbumsScreen = () => {
  return (
    <ExternalView style={styles.container}>
      <Text> TODO </Text>
    </ExternalView>
  );
};

export default function HomeScreen({ navigation }) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "music", title: "Music", icon: "music-note" },
    { key: "albums", title: "Albums", icon: "album" },
    { key: "account", title: "Account", icon: "account" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    music: SongsScreen,
    albums: AlbumsScreen,
    account: () => AccountScreen(() => navigation.replace("Login")),
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
