import React, { useEffect, useState, useContext } from "react";
import { List, Caption, useTheme, FAB } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PropTypes from "prop-types";
import FetchedList from "../general/FetchedList";
import styles from "../styles";
import { toLocalDate } from "../../util/general";
import { isFromSameChat, NotificationContext } from "./NotificationProvider";

const NOTIF_PREFIX = "notifications";

export default function NotificationListScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const { notifications: data, clear } = useContext(NotificationContext);

  useEffect(() => {
    read_cached();
    clear();
  }, []);

  useEffect(() => {
    const newNotifications =
      notifications?.length == 0 ||
      (data?.new && data?.values && data?.values?.length > 0);
    if (newNotifications) {
      addNotifications(data?.values);
      clear();
    }
  }, [data]);

  useEffect(() => {
    if (!notifications) return;
    AsyncStorage.setItem(
      NOTIF_PREFIX,
      JSON.stringify(notifications.map((n) => ({ ...n, read: true })))
    ).catch(() => toast.show("Could not store notifications"));
  }, [notifications]);

  const addNotifications = (notifications) => {
    setNotifications((prev) =>
      [...prev, ...notifications].sort((a, b) => (b.date > a.date ? 1 : -1))
    );
  };

  const read_cached = async () => {
    try {
      const local = await AsyncStorage.getItem(NOTIF_PREFIX);
      local && addNotifications(JSON.parse(local));
    } catch (e) {
      console.error(e);
      toast.show("Could not get cached notifications");
    }
  };

  const onPress = (data) => {
    const body = data?.value?.body;
    if (body?.type != "message") return;
    const id = body?.sender?.id;
    navigation.push("ChatScreen", {
      id,
    });
    setNotifications(
      notifications.map((n) => ({
        ...n,
        read: isFromSameChat(n?.value?.body, id) ? true : n.read,
      }))
    );
  };

  const item = ({ data }) => {
    const statusStyle = data?.read ? undefined : styles.bold;
    return (
      <List.Item
        title={data?.value?.title}
        titleStyle={statusStyle}
        description={data?.value?.message}
        descriptionStyle={statusStyle}
        onPress={() => onPress(data)}
        left={(props) => <NotificationIcon props={props} data={data} />}
        right={({ style, ...rest }) => (
          <Caption
            {...rest}
            style={[
              style,
              {
                textAlignVertical: "center",
              },
              statusStyle,
            ]}
          >
            {getDateText(data?.date)}
          </Caption>
        )}
      />
    );
  };

  return (
    <>
      <FetchedList
        response={{ data: notifications }}
        emptyMessage="No notifications"
        style={styles.container}
        itemComponent={item}
      />
      <FAB
        style={styles.fab}
        onPress={() => setNotifications([])}
        icon="delete"
      />
    </>
  );
}

function getDateText(dateText) {
  const date = toLocalDate(new Date(dateText));
  const now = toLocalDate(new Date());
  if (date.getDate() == now.getDate()) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  return date.toLocaleDateString();
}

function NotificationIcon({ data, props: { color, ...rest } }) {
  const type = data?.value?.body?.type;
  const theme = useTheme();
  if (type == "message") {
    return (
      <List.Icon
        {...rest}
        icon={data?.read ? "comment" : "comment-eye"}
        color={data?.read ? color : theme.colors.primary}
      ></List.Icon>
    );
  }

  return null;
}

NotificationListScreen.propTypes = {
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

NotificationIcon.propTypes = {
  data: PropTypes.any.isRequired,
  props: PropTypes.any,
};
