import React from "react";
import PropTypes from "prop-types";
import { List } from "react-native-paper";
import { getArtistsAsString } from "../../util/general";
import AppContext from "../AppContext";
import { webApi, fetch } from "../../util/services";

export default function SongItem({ data, right }) {
  const context = React.useContext(AppContext);

  const onPress = async (song) => {
    try {
      let res = await fetch(webApi + "/songs/songs/" + song.id);
      song.url = res.file;
      context.setSong(song);
    } catch (e) {
      console.log("here");
      console.error(e);
      toast.show("Could not play song :(", {
        duration: 3000,
      });
    }
  };

  return (
    <List.Item
      title={data.name}
      description={getArtistsAsString(data.artists)}
      right={right}
      onPress={() => onPress(data)}
    />
  );
}

SongItem.propTypes = {
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
