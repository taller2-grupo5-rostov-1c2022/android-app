import React from "react";
import PropTypes from "prop-types";
import { AudioContext } from "../general/AudioProvider";
import { fetch, SONGS_URL } from "../../util/services";
import SongItem from "./SongItem";
import { ActivityIndicator } from "react-native-paper";

export default function PlayableSongItem({ data, right }) {
  const context = React.useContext(AudioContext);
  const [loading, setLoading] = React.useState(false);

  const onPress = async (song) => {
    setLoading(true);
    try {
      let res = await fetch(SONGS_URL + song.id);
      song.url = res.file;
      context.setSong(song);
      context.setPaused(false);
    } catch (e) {
      console.error(e);
      toast.show("Could not play song :(");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SongItem
      data={data}
      right={right}
      onPress={loading ? undefined : () => onPress(data)}
      left={() => (
        <ActivityIndicator
          color="gray"
          animating={loading}
          style={loading ? undefined : { display: "none" }}
        />
      )}
    />
  );
}

PlayableSongItem.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    artists: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired
    ),
  }),
  right: PropTypes.func,
};
