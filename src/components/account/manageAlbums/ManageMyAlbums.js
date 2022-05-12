import React from "react";
import AlbumDialog from "./AlbumDialog";
import PropTypes from "prop-types";
import CrudList from "../../general/CrudList.js";

export default function ManageMyAlbums() {
  const propGen = (album) => {
    return {
      title: album.name,
      description: album.genre,
    };
  };

  return (
    <CrudList
      url="/songs/my_albums/"
      editDialog={AlbumDialog}
      propGen={propGen}
    />
  );
}

ManageMyAlbums.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
