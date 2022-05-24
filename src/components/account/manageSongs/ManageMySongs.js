import React from "react";
import SongDialog from "./SongDialog";
import PropTypes from "prop-types";
import CrudList from "../../general/CrudList.js";
import SongItem from "../../songs/SongItem";
import { SONGS_URL } from "../../../util/services";

export default function ManageMySongs() {
  return (
    <CrudList
      url={SONGS_URL}
      editDialog={SongDialog}
      itemComponent={SongItem}
      emptyMessage="You don't have any songs yet"
    />
  );
}

ManageMySongs.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
