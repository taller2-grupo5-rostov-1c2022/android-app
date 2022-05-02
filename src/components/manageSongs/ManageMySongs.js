import React from "react";
import { webApi, useSWR, json_fetcher } from "../../util/services";
import {
  Headline,
  List,
  ActivityIndicator,
  Portal,
  FAB,
} from "react-native-paper";
import styles from "../styles.js";
import ExternalView from "../ExternalView";
import SongDialog from "./SongDialog";
import PropTypes from "prop-types";

export default function ManageMySongs() {
  const songs = useSWR(webApi + "/songs/", json_fetcher);
  const [dialog, setDialog] = React.useState(null);

  const hideDialog = () => {
    setDialog(null);
    //navigation.replace("ManageMySongs");
    songs.mutate();
  };

  const addDialog = (props) => {
    setDialog(
      <Portal>
        <SongDialog hideDialog={hideDialog} {...props} />
      </Portal>
    );
  };

  const content = () => {
    if (!songs.data && songs.isValidating)
      return (
        <ActivityIndicator size="large" style={styles.activityIndicator} />
      );

    if (songs.error) return <Headline>Error: {songs.error.message}</Headline>;

    return mapData(songs.data, addDialog);
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
      {content()}
    </ExternalView>
  );
}

function mapData(data, addDialog) {
  return data.map((song) => {
    return (
      <List.Item
        title={song.name}
        description={"by " + song.artists}
        key={song.id}
        onPress={() => {
          addDialog({ song });
        }}
      />
    );
  });
}

ManageMySongs.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
