import React, { useContext, useMemo } from "react";
import { View } from "react-native";
import {
  Appbar,
  useTheme,
  Caption,
  ProgressBar,
  Title,
} from "react-native-paper";
import TextTicker from "react-native-text-ticker";
import styles from "./styles.js";
import { AudioContext } from "./general/AudioProvider";

const Player = () => {
  const context = useContext(AudioContext);
  const playIcon = context?.paused ? "play" : "pause";
  const theme = useTheme();
  const color = theme.dark ? "white" : "black";
  const togglePlay = () => {
    context.setPaused((paused) => !paused);
  };

  return (
    <>
      <Progress />

      <Appbar
        style={[styles.player, styles.row].concat(
          context.song === "" ? { display: "none" } : []
        )}
      >
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <TextTicker scrollSpeed={50}>
            <Title
              style={{
                color: theme.colors.text,
                fontSize: 18,
                lineHeight: 20,
              }}
            >
              {context.song.name}
            </Title>
          </TextTicker>
          <TextTicker scrollSpeed={50}>
            <Caption style={{ fontSize: 14, lineHeight: 16 }}>
              {context.song.artists?.map((artist) => artist.name).join(", ")}
            </Caption>
          </TextTicker>
        </View>
        <View
          style={[
            styles.row,
            { justifyContent: "flex-end", alignContent: "center" },
          ]}
        >
          <Appbar.Action
            icon="skip-previous"
            color={color}
            onPress={context.previous}
          />
          <Appbar.Action icon={playIcon} color={color} onPress={togglePlay} />
          <Appbar.Action
            icon="skip-next"
            color={color}
            onPress={context.next}
          />
        </View>
      </Appbar>
    </>
  );
};
const Progress = () => {
  const context = useContext(AudioContext);
  const theme = useTheme();

  const current = useMemo(
    () => getTimeStamp(context.durationInfo.current),
    [context.durationInfo.current]
  );

  const total = useMemo(
    () => getTimeStamp(context?.durationInfo?.total),
    [context?.durationInfo?.total]
  );

  const color = theme.dark ? "white" : "black";
  let progress = context.durationInfo.current / context.durationInfo.total;
  if (!(progress >= 0 && progress <= 1)) {
    return null;
  }

  return (
    <Appbar
      style={[styles.playerProgress].concat(
        context.song === "" ? { display: "none" } : []
      )}
    >
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

function getTimeStamp(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds = String(seconds - minutes * 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}
export default Player;
