import * as React from "react";
import { Appbar } from "react-native-paper";
import styles from "./styles.js";
import appContext from "./appContext.js";
import { Audio } from "expo-av";

const music = async (uri) => {
  const source = {
    uri,
  };
  const { sound } = await Audio.Sound.createAsync(source);
  //await sound.loadAsync();
  await sound.playAsync();
};

const Player = () => {
  const [paused, setPaused] = React.useState(true);
  // const [active, setActive] = React.useState(true);
  // const playerContext = React.createContext();
  const context = React.useContext(appContext);
  const playIcon = paused ? "play" : "pause";

  const play = () => {
    if (paused) {
      music(context.songUrl);
      setPaused(false);
    } else {
      setPaused(true);
    }
  };

  return (
    <Appbar style={styles.bottom}>
      <Appbar.Content title={context.name} subtitle={context.artist} />
      <Appbar.Action
        icon="heart-outline"
        onPress={() => console.log("Pressed heart")}
      />
      <Appbar.Action icon={playIcon} onPress={play} />
      <Appbar.Action
        icon="skip-next"
        onPress={() => console.log("Pressed skip")}
      />
    </Appbar>
  );
};

export default Player;
