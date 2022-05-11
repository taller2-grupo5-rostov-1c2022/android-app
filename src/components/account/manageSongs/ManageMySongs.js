import React from "react";
import SongDialog from "./SongDialog";
import PropTypes from "prop-types";
import CrudList from "../../general/CrudList.js";

export default function ManageMySongs() {
  const propGen = (song) => {
    return {
      title: song.name,
      description:
        "by " + song.artists?.map((artist) => artist.name).join(", "),
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
