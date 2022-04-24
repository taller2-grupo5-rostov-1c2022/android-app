import React from "react";
import { Dialog, Button, Caption, TextInput, Title } from "react-native-paper";
import { View } from "react-native";
import { webApi } from "../util/services";

export default function SongDialog(hideDialog, key, intialData) {
  const [songData, setSongData] = React.useState(intialData);

  const onSave = async () => {
    const response = await fetch(webApi + "/songs?song_id=" + key, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: `{
        "info": ${JSON.stringify(songData)},
        }`,
    });

    response.json().then((data) => {
      console.log(data);
    });

    hideDialog();
  };

  return (
    <Dialog visible="true" onDismiss={hideDialog}>
      <Dialog.Title>Edit Song</Dialog.Title>
      <Dialog.Content>
        <View>
          <TextInput
            mode="flat"
            label="Song name"
            placeholder={intialData ? intialData.name : ""}
          />
          <TextInput
            mode="flat"
            label="Authors"
            placeholder={intialData ? intialData.artist_name : ""}
          />
          <TextInput
            mode="flat"
            label="Description"
            placeholder="WIP, ignored"
          />
          <Title>Song file</Title>
          <View style={{ flexDirection: "row", alignContent: "center" }}>
            {" "}
            <Button type="contained" icon="file-music">
              Pick file
            </Button>
            <Caption>{key ? "Keep current file" : "No file selected"}</Caption>
          </View>
        </View>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onSave}>Save</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
