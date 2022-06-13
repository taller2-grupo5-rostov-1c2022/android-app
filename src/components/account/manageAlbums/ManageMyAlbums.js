import React from "react";
import PropTypes from "prop-types";
import CrudList from "../../general/CrudList.js";
import AlbumItem from "../../albums/AlbumItem";
import { MY_ALBUMS_URL, ALBUMS_URL } from "../../../util/services";
import FormDefinition, { defaultGen, getMySongs } from "./AlbumForm";
import { saveAlbum, deleteAlbum } from "../../../util/requests";

export default function ManageMyAlbums() {
  return (
    <CrudList
      url={MY_ALBUMS_URL}
      itemComponent={AlbumItem}
      emptyMessage="You don't have any albums yet"
      revalidateUrl={ALBUMS_URL}
      dialogProps={{
        name: "Album",
        defaultGen,
        onSave: saveAlbum,
        onDelete: deleteAlbum,
        form: FormDefinition,
        extraFetcher: getMySongs,
      }}
    />
  );
}

ManageMyAlbums.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
