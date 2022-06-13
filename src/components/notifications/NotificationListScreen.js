import React, { useEffect, useState } from "react";
import { List, Caption, useTheme, FAB } from "react-native-paper";
import { addNotificationReceivedListener } from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PropTypes from "prop-types";
import FetchedList from "../general/FetchedList";
import styles from "../styles";
import { NOTIFICATIONS_URL, fetch } from "../../util/services";
import { toLocalDate } from "../../util/general";

const NOTIF_PREFIX = "notifications";

export default function NotificationListScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    read_cached();
    fetch_notifications();
  }, []);

  const fetch_notifications = async () => {
    try {
      const data = await fetch(NOTIFICATIONS_URL);
      data?.length > 0 &&
        addNotifications(
          data.map((n) => {
            n.body = JSON.parse(n.body);
            return {
              value: n,
              date: new Date().toISOString(),
              read: false,
            };
          })
        );
      await fetch(NOTIFICATIONS_URL, { method: "DELETE" });
    } catch (e) {
      console.error(e);
      toast.show("Could not update notifications");
    }
  };

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

  useEffect(() => {
    const sub = addNotificationReceivedListener(fetch_notifications);
    return () => sub.remove();
  }, []);

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
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    const body = data?.value?.body;
    if (body?.type == "message")
      navigation.push("ChatScreen", {
        id: body?.sender?.id,
      });
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
