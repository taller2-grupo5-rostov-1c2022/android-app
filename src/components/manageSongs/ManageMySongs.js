import React from "react";
import { Portal, FAB } from "react-native-paper";
import styles from "../styles.js";
import ExternalView from "../ExternalView";
import SongDialog from "./SongDialog";
import PropTypes from "prop-types";
import SongList from "../SongList";
import { webApi, json_fetcher, useSWR } from "../../util/services";

export default function ManageMySongs() {
  const [dialog, setDialog] = React.useState(null);
  const songs = useSWR(webApi + "/songs/", json_fetcher);

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
    <ExternalView
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
      <SongList
        songs={songs}
        onPress={(song) => addDialog(song)}
        propGen={propGen}
      />
    </ExternalView>
  );
}

ManageMySongs.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
