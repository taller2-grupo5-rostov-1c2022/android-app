import React from "react";
import AlbumDialog from "./AlbumDialog";
import PropTypes from "prop-types";
import CrudList from "../../general/CrudList.js";
import { ShapedImage } from "../../general/ShapedImage";

export default function ManageMyAlbums() {
  const propGen = (album) => {
    return {
      title: album.name,
      description: album.genre,
      left: () => (
        <ShapedImage
          icon="album"
          size={50}
          shape="square"
          imageUri={album.cover}
          style={{ marginRight: 10 }}
        />
      ),
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
