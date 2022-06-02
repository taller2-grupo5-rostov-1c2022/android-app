import React from "react";
import { IconButton, Button, Title } from "react-native-paper";
import { View } from "react-native";
import FetchedList from "./../general/FetchedList";
import PlayableSongItem from "./PlayableSongItem";
import styles from "../styles";
import { fetch, SONGS_URL } from "../../util/services";
import { AudioContext } from "../general/AudioProvider";
import PropTypes from "prop-types";

export default function SongList({
  songs,
  onPlaylistAdd,
  isValidating,
  title,
  emptyMessage,
}) {
  const context = React.useContext(AudioContext);
  const [loading, setLoading] = React.useState(false);
  let song = ({ data }) => (
    <PlayableSongItem
      data={data}
      right={
        onPlaylistAdd
          ? (props) => (
              <IconButton
                {...props}
                onPress={() => onPlaylistAdd(data)}
                icon="playlist-plus"
              />
            )
          : undefined
      }
    />
  );

  let playAllButton = null;
  if (songs?.length > 0)
    playAllButton = (
      <Button
        mode="contained"
        style={([styles.button], { marginTop: "3%", alignSelf: "center" })}
        onPress={() => playSongList(songs, context, setLoading)}
        disabled={loading ? "true" : undefined}
        icon={loading ? undefined : "play"}
        loading={loading}
      >
        Play Songs
      </Button>
    );

  return (
    <View style={{ width: "100%" }}>
      <View>{playAllButton}</View>
      <Title>{title}</Title>
      <View style={{ marginVertical: "5%", flex: 1 }}>
        <FetchedList
          response={{ data: songs, isValidating: isValidating }}
          itemComponent={song}
          viewProps={{ style: { width: "100%" } }}
          emptyMessage={emptyMessage}
          scrollToBottom={true}
        />
      </View>
    </View>
  );
}

export async function playSongList(songs, context, setLoading) {
  setLoading && setLoading(true);
  try {
    let songsWithUrl = await Promise.all(
      songs.map((song) => fetch(SONGS_URL + song.id))
    );
    let queue = songsWithUrl.map((song) => {
      song.url = song.file;
      return song;
    });
    context.setSong(queue[0]);
    context.setQueue(queue.slice(1));
    context.setPaused(false);
  } catch (e) {
    console.error(e);
    toast.show("Could not play album :(");
  } finally {
    setLoading && setLoading(false);
  }
}

SongList.propTypes = {
  songs: PropTypes.array,
  onPlaylistAdd: PropTypes.func,
  isValidating: PropTypes.bool,
  title: PropTypes.string,
  emptyMessage: PropTypes.string,
};
