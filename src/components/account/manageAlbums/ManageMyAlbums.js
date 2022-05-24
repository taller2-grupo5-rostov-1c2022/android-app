import React from "react";
import AlbumDialog from "./AlbumDialog";
import PropTypes from "prop-types";
import CrudList from "../../general/CrudList.js";
import AlbumItem from "../../albums/AlbumItem";
import { ALBUMS_URL } from "../../../util/services";

export default function ManageMyAlbums() {
  return (
    <CrudList
      url={ALBUMS_URL}
      editDialog={AlbumDialog}
      itemComponent={AlbumItem}
      emptyMessage="You don't have any albums yet"
      revalidateUrl={ALBUMS_URL}
    />
  );
}

ManageMyAlbums.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
