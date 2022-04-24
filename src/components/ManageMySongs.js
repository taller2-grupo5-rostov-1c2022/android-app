import React from "react";
import { webApi, useSWR, json_fetcher } from "../util/services";
import { Headline, List, ActivityIndicator, Portal } from "react-native-paper";
import styles from "./styles.js";
import ExternalView from "./ExternalView";
import SongDialog from "./SongDialog";
import { useNavigation } from "@react-navigation/native";

export default function ManageMySongs() {
  const songs = useSWR(webApi + "/songs/", json_fetcher);
  const [dialog, setDialog] = React.useState(null);
  const navigation = useNavigation();

  const content = () => {
    if (songs.isValidating) return <ActivityIndicator></ActivityIndicator>;

    if (songs.error) return <Headline>Error: {songs.error.message}</Headline>;

    return mapData(songs.data, setDialog, navigation);
  };

  return (
    <ExternalView style={styles.container}>
      <Portal>{dialog}</Portal>
      {content()}
    </ExternalView>
  );
}

function mapData(data, setDialog, navigation) {
  const hideDialog = () => {
    setDialog(null);
    navigation.replace("ManageMySongs");
  };

  return Object.entries(data).map(([key, value]) => {
    return (
      <List.Item
        title={value.name}
        description={"by " + value.artist_name}
        key={key}
        onPress={() =>
          setDialog(
            <SongDialog
              hideDialog={hideDialog}
              songKey={key}
              initialData={value}
            />
          )
        }
      />
    );
  });
}
