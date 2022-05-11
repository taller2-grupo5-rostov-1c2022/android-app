import * as React from "react";
import { Appbar } from "react-native-paper";
import styles from "./styles.js";
import appContext from "./appContext.js";
import { Audio } from "expo-av";

var audio = {
  uri: null,
  sound: null,
};

const play = async (uri) => {
  if (uri && audio.uri !== uri) {
    await audio.sound?.stopAsync();
    await audio.sound?.unloadAsync();
    const { sound } = await Audio.Sound.createAsync({ uri });
    audio.uri = uri;
    audio.sound = sound;
  }
  await audio?.sound?.playAsync();
};

const pause = () => {
  audio?.sound?.pauseAsync();
};

const stop = async () => {
  if (audio.sound != null) {
    await audio.sound?.stopAsync();
    await audio.sound?.unloadAsync();
    audio.uri = null;
    audio.sound = null;
  }
};

const Player = () => {
  const [paused, setPaused] = React.useState(false);

  const context = React.useContext(appContext);
  const playIcon = paused ? "play" : "pause";

  const onPress = () => {
    if (paused) {
      play(context.song.url);
      setPaused(false);
    } else {
      pause();
      setPaused(true);
    }
  };

  React.useEffect(() => {
    if (!paused) {
      play(context.song.url);
    }
  }, [context.song]);

  React.useEffect(() => {
    if (context.stop) {
      stop();
      context.setStop(false);
    }
  }, [context.stop]);

  return (
    <Appbar style={styles.bottom}>
      <Appbar.Content
        title={context.song.name}
        subtitle={context.song.artists?.map((artist) => artist.name).join(", ")}
      />
      <Appbar.Action
        icon="heart-outline"
        onPress={() => console.log("Pressed heart")}
      />
      <Appbar.Action icon={playIcon} onPress={onPress} />
      <Appbar.Action icon="skip-next" onPress={() => context.setStop(true)} />
    </Appbar>
  );
};

export default Player;
