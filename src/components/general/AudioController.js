import React from "react";
import AppContext from "../AppContext.js";
import { Audio } from "expo-av";

export const AudioController = () => {
  const [audio] = React.useState({
    uri: null,
    sound: null,
  });
  const [isPrevious, setIsPrevious] = React.useState(false);
  const [currentSong, setCurrentSong] = React.useState({
    name: "",
    artists: [],
    url: "",
  });

  const [prevSongs, setprevSongs] = React.useState([]);

  const context = React.useContext(AppContext);

  const _onPlaybackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.isLoaded) {
      if (playbackStatus.didJustFinish) {
        next();
      }
    }
  };

  const play = async (uri) => {
    if (uri && audio.uri !== uri) {
      await audio.sound?.stopAsync();
      await audio.sound?.unloadAsync();
      const { sound } = await Audio.Sound.createAsync({ uri });
      sound.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);
      audio.uri = uri;
      audio.sound = sound;
    }
    await audio?.sound?.playAsync();
  };

  const previous = () => {
    console.log(prevSongs.length);
    if (prevSongs.length == 0) return;
    const prevSong = prevSongs[prevSongs.length - 1];
    setprevSongs(prevSongs.slice(0, -1));
    setIsPrevious(true);
    context.setQueue((queue) => [currentSong, ...queue]);
    context.setSong(prevSong);
  };

  const next = () => {
    console.log(context.queue);
    if (context.queue.length == 0) return;
    const nextSong = context.queue[0];
    context.setQueue((queue) => queue.slice(1));
    context.setSong(nextSong);
  };

  React.useEffect(() => {
    console.log("audio");
    if (currentSong.name && !isPrevious && (currentSong.name != context.song.name)) {
      setprevSongs((prevSongs) => [...prevSongs, currentSong]);
      console.log(prevSongs);
    }
    setIsPrevious(false);
    setCurrentSong({
      name: context.song.name,
      artists: context.song.artists,
      url: context.song.url,
    });
    if (!context.paused) {
      play(context.song.url);
    }
  }, [context.song]);

  React.useEffect(() => {
    if (context.paused) {
      audio?.sound?.pauseAsync();
    } else {
      play(context.song.url);
    }
  }, [context.paused]);

  React.useEffect(() => {
    if (context.stop) {
      if (audio.sound != null) {
        audio.sound?.stopAsync();
        audio.sound?.unloadAsync();
        audio.uri = null;
        audio.sound = null;
      }
      context.setStop(false);
    }
  }, [context.stop]);

  React.useEffect(() => {
    if (context.previous) {
      previous();
      context.setPrevious(false);
    }
  }, [context.previous]);

  React.useEffect(() => {
    if (context.next) {
      next();
      context.setNext(false);
    }
  }, [context.next]);

  return null;
};

export default AudioController;
