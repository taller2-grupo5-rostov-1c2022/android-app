import React from "react";
import { Portal, FAB } from "react-native-paper";
import styles from "../styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import SongDialog from "./SongDialog";
import PropTypes from "prop-types";
import FetchedList from "../general/FetchedList";
import { webApi, json_fetcher, useSWR } from "../../util/services";

export default function ManageMySongs() {
  const [dialog, setDialog] = React.useState(null);
  const songs = useSWR(webApi + "/my_albums/", json_fetcher);

  const hideDialog = () => {
    setDialog(null);
    songs.mutate();
  };

  const addDialog = (song) => {
    setDialog(
      <Portal>
        <SongDialog hideDialog={hideDialog} song={song} />
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
        response={songs}
        onPress={(song) => addDialog(song)}
        propGen={propGen}
      />
    </SafeAreaView>
  );
}

ManageMySongs.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
