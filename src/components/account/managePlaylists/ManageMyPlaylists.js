import React from "react";
import PropTypes from "prop-types";
import CrudList from "../../general/CrudList.js";
import PlaylistDialog from "./PlaylistDialog";
import PlaylistItem from "../../playlists/PlaylistItem.js";
import { MY_PLAYLISTS_URL } from "../../../util/services.js";

export default function ManageMyPlaylists() {
  return (
    <CrudList
      url={MY_PLAYLISTS_URL}
      editDialog={PlaylistDialog}
      itemComponent={PlaylistItem}
      emptyMessage="You don't have any playlists yet"
      revalidateUrl={MY_PLAYLISTS_URL}
    />
  );
}

ManageMyPlaylists.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
