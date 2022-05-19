import React from "react";
import PropTypes from "prop-types";
import CrudList from "../../general/CrudList.js";
import PlaylistDialog from "./PlaylistDialog";
import PlaylistItem from "../../playlists/PlaylistItem.js";

export default function ManageMyPlaylists() {
  return (
    <CrudList
      url="/songs/my_playlists/"
      editDialog={PlaylistDialog}
      itemComponent={PlaylistItem}
      emptyMessage="You don't have any playlists yet"
    />
  );
}

ManageMyPlaylists.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
