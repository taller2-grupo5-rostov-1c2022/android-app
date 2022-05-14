import React from "react";
import SongDialog from "./SongDialog";
import PropTypes from "prop-types";
import CrudList from "../../general/CrudList.js";
import { getArtistsAsString } from "../../../util/general";

export default function ManageMySongs() {
  const propGen = (song) => {
    return {
      title: song.name,
      description: getArtistsAsString(song.artists),
    };
  };

  return (
    <CrudList
      url="/songs/my_songs/"
      editDialog={SongDialog}
      propGen={propGen}
    />
  );
}

ManageMySongs.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
