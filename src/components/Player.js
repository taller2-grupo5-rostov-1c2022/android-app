import React, { useContext, useMemo } from "react";
import { View } from "react-native";
import { Appbar, useTheme, Caption, ProgressBar } from "react-native-paper";
import PropTypes from "prop-types";
import styles from "./styles.js";
import { AudioContext, DurationContext } from "./general/AudioProvider";

const Player = () => {
  const context = useContext(AudioContext);
  const playIcon = context?.paused ? "play" : "pause";

  const togglePlay = () => {
    context.setPaused((paused) => !paused);
  };

  return (
    <>
      <Progress visible={context.song !== ""} />
      <Appbar
        style={[styles.player].concat(
          context.song === "" ? { display: "none" } : []
        )}
      >
        <Appbar.Content
          title={context.song.name}
          subtitle={context.song.artists
            ?.map((artist) => artist.name)
            .join(", ")}
        />
        <Appbar.Action icon="skip-previous" onPress={context.previous} />
        <Appbar.Action icon={playIcon} onPress={togglePlay} />
        <Appbar.Action icon="skip-next" onPress={context.next} />
      </Appbar>
    </>
  );
};

export default Player;

const Progress = ({ visible }) => {
  const duration = useContext(DurationContext);
  const theme = useTheme();

  const current = useMemo(
    () => getTimeStamp(duration.current),
    [duration.current]
  );

  const total = useMemo(() => getTimeStamp(duration.total), [duration.total]);

  const color = theme.dark ? "white" : "black";
  let progress = duration.current / duration.total;
  if (!(progress >= 0 && progress <= 1) || !visible) {
    return null;
  }

  return (
    <Appbar style={[styles.playerProgress]}>
      <View style={[styles.row, { justifyContent: "center", flex: 1 }]}>
        <Caption style={styles.progressLabel}>{current}</Caption>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ProgressBar
            progress={progress}
            color={color}
            style={styles.progress}
          />
        </View>
        <Caption style={styles.progressLabel}>{total}</Caption>
      </View>
    </Appbar>
  );
};

Progress.propTypes = {
  visible: PropTypes.bool,
};

function getTimeStamp(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds = String(seconds - minutes * 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}
