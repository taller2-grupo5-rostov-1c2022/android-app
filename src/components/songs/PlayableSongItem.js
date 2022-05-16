import React from "react";
import PropTypes from "prop-types";
import AppContext from "../AppContext";
import { webApi, fetch } from "../../util/services";
import SongItem from "./SongItem";

export default function PlayableSongItem({ data, right }) {
  const context = React.useContext(AppContext);

  const onPress = async (song) => {
    try {
      let res = await fetch(webApi + "/songs/songs/" + song.id);
      song.url = res.file;
      context.setSong(song);
    } catch (e) {
      console.error(e);
      toast.show("Could not play song :(", {
        duration: 3000,
      });
    }
  };

  return <SongItem right={right} onPress={() => onPress(data)} />;
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
