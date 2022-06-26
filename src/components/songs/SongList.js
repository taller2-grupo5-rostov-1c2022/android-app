import React from "react";
import { IconButton, Button, Title } from "react-native-paper";
import { View } from "react-native";
import FetchedList from "./../general/FetchedList";
import PlayableSongItem from "./PlayableSongItem";
import styles from "../styles";
import { fetch, SONGS_URL } from "../../util/services";
import { AudioContext } from "../general/AudioProvider";
import PropTypes from "prop-types";
import { errStr } from "../../util/general";

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
        style={[styles.button, { marginTop: "3%", alignSelf: "center" }]}
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
      {title ? <Title>{title}</Title> : undefined}
      <FetchedList
        data={songs}
        isValidating={isValidating}
        itemComponent={song}
        contentContainerStyle={{ flex: 1 }}
        style={{ flex: 1 }}
        emptyMessage={emptyMessage}
        noScroll={true}
      />
    </View>
  );
}

export async function playSongList(songs, context, setLoading) {
  setLoading && setLoading(true);
  try {
    const firstSong = await fetch(SONGS_URL + songs[0].id).catch((e) => {
      const detail = errStr(e);
      const error_message = `Cannot play ${songs[0].name}\n${detail}`;
      toast.show(error_message);
    })
    songs[0].url = firstSong.file;
    context.setSong(songs[0]);
    context.setPaused(false);
    const songsWithUrl = await Promise.all(
      songs.slice(1).map((song) =>
        fetch(SONGS_URL + song.id).catch((e) => {
          const detail = errStr(e);
          const error_message = `Cannot play ${song.name}\n${detail}`;
          toast.show(error_message);
        })
      )
    );

    const validSongs = songsWithUrl.filter((song) => song);

    const queue = validSongs.map((song) => {
      song.url = song.file;
      return song;
    });
    context.setQueue(queue);
  } catch (e) {
    const detail = errStr(e);
    toast.show(`Could not play list\n${detail}`);
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
