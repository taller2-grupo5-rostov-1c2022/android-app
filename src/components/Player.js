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
  const [isPrevious, setIsPrevious] = React.useState(false);
  const [currentSong, setCurrentSong] = React.useState({
    name: "",
    artists: [],
    url: "",
 });
  const [prevSongs, setprevSongs] = React.useState([]);

  const context = React.useContext(appContext);
  const playIcon = paused ? "play" : "pause";
 
  const onPress = () => {
    console.log(prevSongs);
    if (paused) {
      play(context.song.url);
      setPaused(false);
    } else {
      pause();
      setPaused(true);
    }
  };

  const previous = () => {
    console.log(prevSongs.length);
    if (prevSongs.length == 0) return;
    const prevSong = prevSongs.at(-1);
    setprevSongs(prevSongs.slice(0, -1));
    setIsPrevious(true);
    context.setQueue(queue => [currentSong, ...queue]);
    context.setSong(prevSong);
  }

  const next = () => {
    console.log(context.queue);
    if (context.queue.length == 0) return;
    const nextSong = context.queue[0];
    context.setQueue(queue => queue.slice(1));
    context.setSong(nextSong);
  };

  React.useEffect(() => {
    console.log(context.song.name);
    if (currentSong.name && !isPrevious) {
      setprevSongs(prevSongs => [...prevSongs, currentSong]);
      console.log(prevSongs);
    }
    setIsPrevious(false);
    setCurrentSong({
      name: context.song.name,
      artists: context.song.artists,
      url: context.song.url,
   })
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
      subtitle={context.song.artists?.map((artist) => artist.name).join(", ")} />
      <Appbar.Action
        icon="skip-previous"
        onPress={previous}
      />
      <Appbar.Action icon={playIcon} onPress={onPress} />
      <Appbar.Action
        icon="skip-next"
        onPress={next}
      />
    </Appbar>
  );
};

export default Player;
