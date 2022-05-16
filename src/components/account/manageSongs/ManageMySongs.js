import React from "react";
import SongDialog from "./SongDialog";
import PropTypes from "prop-types";
import CrudList from "../../general/CrudList.js";
import SongItem from "../../songs/SongItem";

export default function ManageMySongs() {
  return (
    <CrudList
      url="/songs/my_songs/"
      editDialog={SongDialog}
      itemComponent={SongItem}
    />
  );
}

ManageMySongs.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
