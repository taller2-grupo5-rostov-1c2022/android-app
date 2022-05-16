import React from "react";
import AlbumDialog from "./AlbumDialog";
import PropTypes from "prop-types";
import CrudList from "../../general/CrudList.js";
import AlbumItem from "../../albums/AlbumItem";

export default function ManageMyAlbums() {
  return (
    <CrudList
      url="/songs/my_albums/"
      editDialog={AlbumDialog}
      itemComponent={AlbumItem}
    />
  );
}

ManageMyAlbums.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
