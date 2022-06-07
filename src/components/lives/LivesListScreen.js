import React from "react";
import { STREAMINGS_URL, json_fetcher, useSWR } from "../../util/services";
import { List, FAB } from "react-native-paper";
import styles from "../styles.js";
import { View } from "react-native";
import FetchedList from "../general/FetchedList";
import PropTypes from "prop-types";

export default function LivesListScreen({ navigation }) {
  const response = useSWR(STREAMINGS_URL, json_fetcher);

  const item = ({ data }) => (
    <List.Item
      title={`${data?.name}'s live streaming`}
      onPress={() =>
        navigation.replace("ListeningLiveScreen", {
          hostName: data?.name,
          hostId: data?.id,
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
      <FAB
        icon="plus"
        onPress={() => navigation.replace("HostingLiveScreen")}
        style={styles.fab}
      />
    </View>
  );
}

LivesListScreen.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
