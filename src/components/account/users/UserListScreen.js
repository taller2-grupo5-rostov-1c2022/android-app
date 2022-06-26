import React, { useCallback } from "react";
import { USERS_URL, useSWRInfinite, getUrl } from "../../../util/services";
import { List, IconButton } from "react-native-paper";
import styles from "../../styles.js";
import { View } from "react-native";
import FetchedList from "../../general/FetchedList";
import { json_fetcher } from "../../../util/services";
import { getAuth } from "firebase/auth";
import UserInfo from "./UserInfo";
import PropTypes from "prop-types";
import { ShapedImage } from "../../general/ShapedImage";
import Portal from "../../general/NavigationAwarePortal";

export default function UserListScreen({ navigation }) {
  const [modalStatus, setModalStatus] = React.useState({
    visible: false,
    user: null,
  });
  const users = useSWRInfinite(
    (index, prev) => getUrl(USERS_URL, index, prev),
    json_fetcher
  );
  const current_uid = getAuth()?.currentUser?.uid;

  const customData = useCallback((users) => {
    return users?.filter((user) => user.id !== current_uid);
  });

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
      onPress={() => navigation.push("ChatScreen", { id: data?.id })}
      right={(props) => (
        <IconButton
          {...props}
          icon="information-outline"
          onPress={() => setModalStatus({ visible: true, user: data })}
        />
      )}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <FetchedList
          {...users}
          itemComponent={item}
          emptyMessage={"There is nothing here..."}
          style={styles.listScreen}
          customData={customData}
        />
        <Portal>
          <UserInfo modalStatus={modalStatus} setModalStatus={setModalStatus} />
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
