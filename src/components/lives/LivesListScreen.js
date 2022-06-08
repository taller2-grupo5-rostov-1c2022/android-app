import React, { useContext, useState } from "react";
import { STREAMINGS_URL, json_fetcher, useSWR } from "../../util/services";
import { List, FAB, Portal } from "react-native-paper";
import styles from "../styles.js";
import { View } from "react-native";
import FetchedList from "../general/FetchedList";
import PropTypes from "prop-types";
import { SessionContext } from "../session/SessionProvider";
import { ARTIST_ROLES } from "../../util/general";
import HostDialog from "./HostDialog";

export default function LivesListScreen({ navigation }) {
  const response = useSWR(STREAMINGS_URL, json_fetcher);
  const session = useContext(SessionContext);
  const [visible, setVisible] = useState(false);

  const item = ({ data }) => (
    <List.Item
      title={`${data?.name}'s live streaming`}
      onPress={() =>
        navigation.replace("ListeningLiveScreen", {
          hostName: data?.name,
          hostId: data?.artist?.id,
          token: data?.token,
        })
      }
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <FetchedList
        response={response}
        itemComponent={item}
        emptyMessage={"There are no active live streams"}
        style={styles.listScreen}
      />
      <Portal>
        {ARTIST_ROLES.includes(session?.role) ? (
          <FAB
            icon="microphone-plus"
            onPress={() => setVisible(true)}
            style={styles.fab}
          />
        ) : null}
        <HostDialog
          visible={visible}
          user={session.user}
          navigation={navigation}
          hideDialog={() => setVisible(false)}
        />
      </Portal>
    </View>
  );
}

LivesListScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
