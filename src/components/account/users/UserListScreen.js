import React from "react";
import { USERS_URL, useSWR } from "../../../util/services";
import { Portal, List } from "react-native-paper";
import styles from "../../styles.js";
import { View } from "react-native";
import FetchedList from "../../general/FetchedList";
import { fetch } from "../../../util/services";
import { getAuth } from "firebase/auth";
import UserInfo from "./UserInfo";
import PropTypes from "prop-types";
import { ShapedImage } from "../../general/ShapedImage";

// Removes the current user from the list
async function customFetcher(url) {
  let current_uid = getAuth()?.currentUser?.uid;
  let data = await fetch(url);

  return data.filter((user) => user.id !== current_uid);
}

export default function UserListScreen({ navigation }) {
  const [modalStatus, setModalStatus] = React.useState({
    visible: false,
    user: null,
  });
  const users = useSWR(USERS_URL, customFetcher);

  const item = ({ data }) => (
    <List.Item
      title={data?.name}
      left={(props) => (
        <ShapedImage
          {...props}
          imageUri={data?.pfp}
          icon="account"
          size={40}
          shape="circle"
          style={{ marginRight: "2%" }}
        />
      )}
      onPress={() => setModalStatus({ visible: true, user: data })}
    />
  );

  const onChat = () => {
    setModalStatus({ visible: false, user: modalStatus.user });
    navigation.push("ChatScreen", { user: modalStatus.user });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <FetchedList
          response={users}
          itemComponent={item}
          emptyMessage={"There is nothing here..."}
          style={styles.listScreen}
        />
        <Portal>
          <UserInfo
            modalStatus={modalStatus}
            setModalStatus={setModalStatus}
            onChat={onChat}
          />
        </Portal>
      </View>
    </View>
  );
}

UserListScreen.propTypes = {
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
