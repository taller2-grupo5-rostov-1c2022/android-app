import React, { createContext, useState, useEffect } from "react";
import { Audio } from "expo-av";
import PropTypes from "prop-types";

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
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

  const [song, setSong] = useState("");
  const [paused, setPaused] = useState(false);
  const [queue, setQueue] = useState([]);

  const errorOnPlaySong = () => {
    toast.show("Failed to play song :(");
    audio.sound = null;
    audio.uri = null;
    next();
  };

  const _onPlaybackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.isLoaded && playbackStatus.didJustFinish) next();

    if (playbackStatus.error) {
      console.error(playbackStatus.error);
      errorOnPlaySong();
    }
  };

  const play = async (uri) => {
    if (uri && audio.uri !== uri) {
      //await audio.sound?.stopAsync();
      // El catch es para que no muera si no había canción cargada
      await audio.sound?.unloadAsync().catch();
      const { sound } = await Audio.Sound.createAsync({ uri }).catch(
        (error) => {
          console.error(error);
          errorOnPlaySong();
        }
      );
      sound.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);
      audio.uri = uri;
      audio.sound = sound;
    }
    await audio?.sound?.playAsync().catch((error) => {
      console.error(error);
      errorOnPlaySong();
    });
  };

  const previous = () => {
    if (prevSongs.length == 0) return;
    const prevSong = prevSongs[prevSongs.length - 1];
    setprevSongs(prevSongs.slice(0, -1));
    setIsPrevious(true);
    setQueue((queue) => [currentSong, ...queue]);
    setSong(prevSong);
  };

  const next = () => {
    if (queue.length == 0) return;
    const nextSong = queue[0];
    setQueue((queue) => queue.slice(1));
    setSong(nextSong);
  };

  const stop = () => {
    if (audio.sound != null) {
      //audio.sound?.stopAsync();
      audio.sound?.unloadAsync().catch();
      audio.uri = null;
      audio.sound = null;
    }
  };

  useEffect(() => {
    if (currentSong.name && !isPrevious && currentSong.name != song.name) {
      setprevSongs((prevSongs) => [...prevSongs, currentSong]);
    }
    setIsPrevious(false);
    setCurrentSong({
      name: song.name,
      artists: song.artists,
      url: song.url,
    });
    if (!paused) {
      play(song.url);
    }
  }, [song]);

  useEffect(() => {
    if (paused) {
      audio?.sound?.pauseAsync();
    } else {
      play(song.url);
    }
  }, [paused]);

  return (
    <AudioContext.Provider
      value={{
        next,
        previous,
        stop,
        paused,
        setPaused,
        song,
        setSong,
        queue,
        setQueue,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;

AudioProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
