import React from "react";
import { webApi, useSWR, json_fetcher } from "../util/services";
import {
  Headline,
  List,
  ActivityIndicator,
  Portal,
  FAB,
} from "react-native-paper";
import styles from "./styles.js";
import ExternalView from "./ExternalView";
import SongDialog from "./SongDialog";
import { useNavigation } from "@react-navigation/native";

export default function ManageMySongs() {
  const songs = useSWR(webApi + "/songs/", json_fetcher);
  const [dialog, setDialog] = React.useState(null);
  const [adderEnabled, setAdderEnabled] = React.useState(true);
  const navigation = useNavigation();

  const hideDialog = () => {
    setDialog(null);
    navigation.replace("ManageMySongs");
  };

  const addDialog = (props) => {
    setAdderEnabled(false);
    setDialog(
      <Portal>
        <SongDialog hideDialog={hideDialog} {...props} />
      </Portal>
    );
  };

  const content = () => {
    if (songs.isValidating)
      return (
        <ActivityIndicator size="large" style={styles.activityIndicator} />
      );

    if (songs.error) return <Headline>Error: {songs.error.message}</Headline>;

    return mapData(songs.data, addDialog);
  };

  return (
    <ExternalView
      style={dialog ? styles.disabledContainer : styles.container}
      pointerEvents={dialog ? "none" : "auto"}
    >
      <Portal>
        <FAB
          icon="plus"
          style={styles.fab}
          disabled={!adderEnabled}
          onPress={addDialog}
        />
      </Portal>
      <Portal>{dialog}</Portal>
      {content()}
    </ExternalView>
  );
}

function mapData(data, addDialog) {
  return Object.entries(data).map(([key, value]) => {
    return (
      <List.Item
        title={value.name}
        description={"by " + value.artist_name}
        key={key}
        onPress={() => {
          addDialog({ songKey: key, initialData: value });
        }}
      />
    );
  });
}
