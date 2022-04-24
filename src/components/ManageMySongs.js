import React from "react";
import { webApi, useSWR, json_fetcher } from "../util/services";
import {
  Headline,
  List,
  ActivityIndicator,
  Portal,
  Dialog,
  Subheading,
  Button,
  Text,
} from "react-native-paper";
import styles from "./styles.js";
import ExternalView from "./ExternalView";
import { View } from "react-native";

export default function ManageMySongs() {
  const songs = useSWR(webApi + "/songs/", json_fetcher);
  const [dialog, setDialog] = React.useState(null);

  return (
    <ExternalView style={styles.container}>
      <Headline>Manage My Songs</Headline>
      <Portal>{dialog}</Portal>
      {content(songs.isValidating, songs.data, songs.error, setDialog)}
    </ExternalView>
  );
}

function content(isLoading, data, error, setDialog) {
  if (isLoading) return <ActivityIndicator></ActivityIndicator>;

  if (error) return <Headline>Error: {error.message}</Headline>;

  return mapData(data, setDialog);
}

function mapData(data, setDialog) {
  return Object.entries(data).map(([key, value]) => {
    return (
      <List.Item
        title={value.name}
        key={key}
        onPress={() => onEdit(key, value, setDialog)}
      />
    );
  });
}

function onEdit(key, songData, setDialog) {
  const hideDialog = () => setDialog(null);

  setDialog(
    <Dialog visible="true" onDismiss={hideDialog}>
      <Dialog.Title>Edit Song</Dialog.Title>
      <Dialog.Content>
        <View>
          <Subheading>{songData.name}</Subheading>
          <Text>{"Artista: " + songData.artist_name}</Text>
          <Text>{"Key: " + key}</Text>
        </View>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={hideDialog}>Done</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
