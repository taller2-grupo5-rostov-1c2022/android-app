import * as React from "react";
import { Appbar } from "react-native-paper";
import styles from "./styles.js";
import { AudioContext } from "./general/AudioProvider";

const Player = () => {
  const context = React.useContext(AudioContext);
  const playIcon = context?.paused ? "play" : "pause";

  const togglePlay = () => {
    context.setPaused((paused) => !paused);
  };

  return (
    <Appbar
      style={[styles.player].concat(
        context.song === "" ? { display: "none" } : []
      )}
    >
      <Appbar.Content
        title={context.song.name}
        subtitle={context.song.artists?.map((artist) => artist.name).join(", ")}
      />
      <Appbar.Action icon="skip-previous" onPress={context.previous} />
      <Appbar.Action icon={playIcon} onPress={togglePlay} />
      <Appbar.Action icon="skip-next" onPress={context.next} />
    </Appbar>
  );
};

export default Player;
