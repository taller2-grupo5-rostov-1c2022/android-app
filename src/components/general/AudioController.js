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

    if (playbackStatus.error) {
      console.error(playbackStatus.error);
      toast.show("Failed to play song :(", { duration: 3000 });
      audio.sound = null;
      audio.uri = null;
      next();
    }
  };

  const play = async (uri) => {
    if (uri && audio.uri !== uri) {
      //await audio.sound?.stopAsync();
      // El catch es para que no muera si no había canción cargada
      await audio.sound?.unloadAsync().catch();
      const { sound } = await Audio.Sound.createAsync({ uri }).catch((error)=>{
        console.error(error);
        toast.show("Failed to play song :(", { duration: 3000 });
        audio.sound = null;
        audio.uri = null;
        next();
     });
      sound.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);
      audio.uri = uri;
      audio.sound = sound;
    }
    await audio?.sound?.playAsync().catch((error)=>{
      console.error(error);
      toast.show("Failed to play song :(", { duration: 3000 });
      audio.sound = null;
      audio.uri = null;
      next();
   });
  };

  const previous = () => {
    if (prevSongs.length == 0) return;
    const prevSong = prevSongs[prevSongs.length - 1];
    setprevSongs(prevSongs.slice(0, -1));
    setIsPrevious(true);
    context.setQueue((queue) => [currentSong, ...queue]);
    context.setSong(prevSong);
  };

  const next = () => {
    if (context.queue.length == 0) return;
    const nextSong = context.queue[0];
    context.setQueue((queue) => queue.slice(1));
    context.setSong(nextSong);
  };

  React.useEffect(() => {
    if (
      currentSong.name &&
      !isPrevious &&
      currentSong.name != context.song.name
    ) {
      setprevSongs((prevSongs) => [...prevSongs, currentSong]);
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
        //audio.sound?.stopAsync();
        audio.sound?.unloadAsync().catch();
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
