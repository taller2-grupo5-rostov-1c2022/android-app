import React from "react";
import PropTypes from "prop-types";
import CrudList from "../../general/CrudList.js";
import SongItem from "../../songs/SongItem";
import { SONGS_URL, MY_SONGS_URL } from "../../../util/services";
import FormDefinition, { defaultGen } from "./SongForm";
import { saveSong, deleteSong } from "../../../util/requests";

export default function ManageMySongs() {
  return (
    <CrudList
      url={MY_SONGS_URL}
      itemComponent={SongItem}
      emptyMessage="You don't have any songs yet"
      revalidateUrl={SONGS_URL}
      dialogProps={{
        name: "Song",
        defaultGen,
        form: FormDefinition,
        onSave: saveSong,
        onDelete: deleteSong,
      }}
    />
  );
}

ManageMySongs.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
