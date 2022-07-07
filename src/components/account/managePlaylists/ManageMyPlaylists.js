import React from "react";
import PropTypes from "prop-types";
import CrudList from "../../general/CrudList.js";
import PlaylistForm, { defaultGen, getMySongs } from "./PlaylistForm";
import PlaylistItem from "../../playlists/PlaylistItem.js";
import { MY_PLAYLISTS_URL, PLAYLISTS_URL } from "../../../util/services.js";
import { savePlaylist, deletePlaylist } from "../../../util/requests";

export default function ManageMyPlaylists() {
  return (
    <CrudList
      url={MY_PLAYLISTS_URL}
      itemComponent={PlaylistItem}
      emptyMessage="You don't have any playlists yet"
      revalidateUrl={PLAYLISTS_URL}
      dialogProps={{
        name: "Playlist",
        defaultGen,
        onSave: savePlaylist,
        onDelete: deletePlaylist,
        form: PlaylistForm,
        extraFetcher: getMySongs,
      }}
    />
  );
}

ManageMyPlaylists.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
