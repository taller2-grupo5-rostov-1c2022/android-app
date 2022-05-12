import React from "react";
import { Portal, FAB } from "react-native-paper";
import styles from "../styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import AlbumDialog from "./SongDialog";
import PropTypes from "prop-types";
import FetchedList from "../general/FetchedList";
import { webApi, json_fetcher, useSWR } from "../../util/services";

export default function ManageMyAlbums() {
  const [dialog, setDialog] = React.useState(null);
  const response = useSWR(webApi + "/my_albums/", json_fetcher);

  const hideDialog = () => {
    setDialog(null);
    response.mutate();
  };

  const addDialog = (album) => {
    setDialog(
      <Portal>
        <AlbumDialog hideDialog={hideDialog} album={album} />
      </Portal>
    );
  };

  const propGen = (song) => {
    return {
      title: song.name,
      description: "by " + song.artists?.map((artist) => artist.artist_name),
    };
  };

  return (
    <SafeAreaView
      style={[styles.container].concat(dialog ? styles.disabled : [])}
      pointerEvents={dialog ? "none" : "auto"}
    >
      <Portal>
        <FAB
          icon="plus"
          style={styles.fab}
          disabled={dialog != null}
          onPress={addDialog}
        />
      </Portal>
      <Portal>{dialog}</Portal>
      <FetchedList
        response={response}
        onPress={(album) => addDialog(album)}
        propGen={propGen}
      />
    </SafeAreaView>
  );
}

ManageMyAlbums.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
