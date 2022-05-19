import React from "react";
import PropTypes from "prop-types";
import CrudList from "../../general/CrudList.js";
import { List } from "react-native-paper";
import PlaylistDialog from "./PlaylistDialog";

export default function ManageMyPlaylists() {

    const playlist = ({ data }) => (
        <List.Item
          title={data.name}
          description={data.description}
          onPress={() => console.log("tu playlist")}
        />
      );

  return (
    <CrudList
      url="/songs/my_playlists/"
      editDialog={PlaylistDialog}
      itemComponent={playlist}
      emptyMessage="You don't have any playlists yet"
    />
  );
}

ManageMyPlaylists.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
