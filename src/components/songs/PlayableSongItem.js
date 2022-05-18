import React from "react";
import PropTypes from "prop-types";
import AppContext from "../AppContext";
import { webApi, fetch } from "../../util/services";
import SongItem from "./SongItem";
import { ActivityIndicator } from "react-native-paper";

export default function PlayableSongItem({ data, right }) {
  const context = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(false);

  const onPress = async (song) => {
    setLoading(true);
    try {
      let res = await fetch(webApi + "/songs/songs/" + song.id);
      song.url = res.file;
      context.setSong(song);
      context.setPaused(false);
    } catch (e) {
      console.error(e);
      toast.show("Could not play song :(", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SongItem
      data={data}
      right={right}
      onPress={loading ? undefined : () => onPress(data)}
      left={loading ? () => <ActivityIndicator color="gray" /> : undefined}
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
  }).isRequired,
  right: PropTypes.func,
};
