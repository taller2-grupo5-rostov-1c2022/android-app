import React from "react";
import { webApi, useSWR } from "../../../util/services";
import { Portal, List } from "react-native-paper";
import styles from "../../styles.js";
import { View } from "react-native";
import FetchedList from "../../general/FetchedList";
import { fetch } from "../../../util/services";
import { getAuth } from "firebase/auth";
import UserInfo from "./UserInfo";

// Removes the current user from the list
async function customFetcher(url) {
  let current_uid = getAuth()?.currentUser?.uid;
  let data = await fetch(url);

  return data.filter((user) => user.id !== current_uid);
}

export default function UserListScreen() {
  const [modalStatus, setModalStatus] = React.useState({
    visible: false,
    user: null,
  });
  const users = useSWR(`${webApi}/songs/users/`, customFetcher);

  const user = ({ data }) => (
    <List.Item
      title={data?.name}
      left={(props) => <List.Icon {...props} icon="account" />}
      onPress={() => setModalStatus({ visible: true, user: data })}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <FetchedList
          response={users}
          itemComponent={user}
          emptyMessage={"There is nothing here..."}
          style={styles.listScreen}
        />
        <Portal>
          <UserInfo modalStatus={modalStatus} setModalStatus={setModalStatus} />
        </Portal>
      </View>
    </View>
  );
}
