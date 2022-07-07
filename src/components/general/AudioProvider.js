import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Audio } from "expo-av";
import PropTypes from "prop-types";
import { Mutex } from "async-mutex";

export const AudioContext = createContext();
export const DurationContext = createContext();

export const AudioProvider = ({ children }) => {
  const audio = useRef({
    uri: null,
    sound: null,
    old_sound: [],
  }).current;
  const mutex = useRef(new Mutex()).current;
  const [isPrevious, setIsPrevious] = React.useState(false);
  const [currentSong, setCurrentSong] = React.useState({
    name: "",
    artists: [],
    url: "",
  });
  const [duration, setDuration] = useState({
    current: 0,
    total: 0,
  });

  const [prevSongs, setprevSongs] = React.useState([]);
  const [song, setSong] = useState("");
  const [paused, setPaused] = useState(false);
  const [queue, setQueue] = useState([]);

  const errorOnPlaySong = () => {
    toast.show("Failed to play song :(");
    audio.old_sound.push(audio.sound);
    audio.sound = null;
    audio.uri = null;
    unloadSound();
    next();
  };

  const _onPlaybackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.isLoaded) {
      if (playbackStatus.didJustFinish) next();
      else
        setDuration({
          current: playbackStatus.positionMillis,
          total: playbackStatus.durationMillis,
        });
    }
    if (playbackStatus.error) {
      console.error(playbackStatus.error);
      errorOnPlaySong();
    }
  };

  const unloadSound = async () => {
    const filters = await Promise.all(
      audio.old_sound.map(async (sound) => {
        const status = await sound?.getStatusAsync();
        if (!status) return false; //throws away the sound
        if (!status.isLoaded) {
          return false; //throws away the sound
        }
        sound.setOnPlaybackStatusUpdate(null);
        await sound.unloadAsync().catch(); //unload the still loaded
        return true; //we throw them away next iter in case unload fails
      })
    );
    audio.old_sound = audio.old_sound.filter((s, i) => filters[i]);
  };

  const _play = async (uri) => {
    if (uri && audio.uri !== uri) {
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
      audio.old_sound.push(audio.sound);
      audio.sound = sound;
    }
    await audio?.sound?.playAsync().catch((error) => {
      console.warn("Error on Play Song", error);
      errorOnPlaySong();
    });
  };

  const play = async (uri) => mutex.runExclusive(async () => await _play(uri));

  const previous = useCallback(() => {
    if (prevSongs.length == 0) return;
    const prevSong = prevSongs[prevSongs.length - 1];
    setprevSongs(prevSongs.slice(0, -1));
    setIsPrevious(true);
    setQueue((queue) => [currentSong, ...queue]);
    setSong(prevSong);
  }, [prevSongs, currentSong]);

  const next = useCallback(() => {
    if (queue.length == 0) {
      setSong("");
      return;
    }

    const nextSong = queue[0];
    setQueue((queue) => queue.slice(1));
    setSong(nextSong);
  }, [queue]);

  const stop = useCallback(() => {
    if (audio.sound != null) {
      mutex.runExclusive(async () => {
        await audio.sound?.unloadAsync().catch();
        audio.uri = null;
        audio.old_sound.push(audio.sound);
        audio.sound = null;
        await unloadSound();
      });
    }
  }, []);

  useEffect(() => {
    if (song === "") {
      stop();
      return;
    }

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
      value={useMemo(
        () => ({
          next,
          previous,
          stop,
          paused,
          setPaused,
          song,
          setSong,
          queue,
          setQueue,
        }),
        [next, previous, stop, paused, song, queue]
      )}
    >
      <DurationContext.Provider value={duration}>
        {children}
      </DurationContext.Provider>
    </AudioContext.Provider>
  );
};

export default AudioProvider;

AudioProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
