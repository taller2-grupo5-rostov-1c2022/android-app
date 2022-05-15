import * as React from "react";
import { Appbar } from "react-native-paper";
import styles from "./styles.js";
import AppContext from "./AppContext.js";

const Player = () => {
  const context = React.useContext(AppContext);
  const playIcon = context?.paused ? "play" : "pause";

  const togglePlay = () => {
    context.setPaused((paused) => !paused);
  };

  const previous = () => {
    context.setPrevious(true);
  };

  const next = () => {
    context.setNext(true);
  };

  return (
    <Appbar style={styles.player}>
      <Appbar.Content
        title={context.song.name}
        subtitle={context.song.artists?.map((artist) => artist.name).join(", ")}
      />
      <Appbar.Action icon="skip-previous" onPress={previous} />
      <Appbar.Action icon={playIcon} onPress={togglePlay} />
      <Appbar.Action icon="skip-next" onPress={next} />
    </Appbar>
  );
};

export default Player;
