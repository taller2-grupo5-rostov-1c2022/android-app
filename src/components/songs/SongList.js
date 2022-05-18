import React from "react";
import { IconButton, Button, Title } from "react-native-paper";
import { View } from "react-native";
import FetchedList from "./../general/FetchedList";
import PlayableSongItem from "./PlayableSongItem";
import styles from "../styles";
import { fetch, webApi } from "../../util/services";
import AppContext from "../AppContext";
import PropTypes from "prop-types";

export default function SongList({
  songs,
  onPlaylistAdd,
  isValidating,
  title,
  emptyMessage,
}) {
  const context = React.useContext(AppContext);
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
      <FetchedList
        response={{ data: songs, isValidating: isValidating }}
        itemComponent={song}
        viewProps={{ style: { width: "100%" } }}
        emptyMessage={emptyMessage}
      />
    </View>
  );
}

export async function playSongList(songs, context, setLoading) {
  setLoading && setLoading(true);
  try {
    let songsWithUrl = await Promise.all(
      songs.map((song) => fetch(webApi + "/songs/songs/" + song.id))
    );
    let queue = songsWithUrl.map((song) => {
      song.url = song.file;
      return song;
    });
    context.setQueue(queue);
    context.setNext(true);
    context.setPaused(false);
  } catch (e) {
    console.error(e);
    toast.show("Could not play album :(", {
      duration: 3000,
    });
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
