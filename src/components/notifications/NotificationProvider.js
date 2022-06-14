import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  json_fetcher,
  NOTIFICATIONS_URL,
  fetch,
  useSWRImmutable,
} from "../../util/services";
import { addNotificationReceivedListener } from "expo-notifications";
import { setNotificationHandler } from "expo-notifications";

export const NotificationContext = createContext({
  notifications: [],
  clear: async () => {},
  mutate: async () => {},
  setActiveChat: () => {},
  activeChat: null,
});

export default function NotificationProvider({ children }) {
  const { data, mutate, error, isValidating } = useSWRImmutable(
    NOTIFICATIONS_URL,
    json_fetcher
  );
  const [notifications, setNotifications] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    if (!data && isValidating) return;
    setNotifications(
      data?.map((n) => {
        n.body = JSON.parse(n.body);
        return {
          value: n,
          date: new Date().toISOString(),
          read: !!(activeChat && isFromSameChat(n.body, activeChat)),
        };
      }) ?? []
    );
  }, [data]);

  useEffect(() => {
    const sub = addNotificationReceivedListener(() => mutate());
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!error) return;
    console.error(error);
    toast.show("Error fetching notifications");
  }, [error?.status]);

  const clear = async () => {
    try {
      await fetch(NOTIFICATIONS_URL, { method: "DELETE" });
      await mutate();
    } catch (e) {
      console.error(e);
      toast.show("Could not mark notifications as read");
    }
  };

  useEffect(() => {
    setNotificationHandler(
      {
        handleNotification: (n) => defaultHandleNotification(n, activeChat),
      },
      [activeChat]
    );
  }, [activeChat]);

  useEffect(() => {
    return () => setNotificationHandler(null);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, clear, setActiveChat, activeChat }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function isFromSameChat(body, id) {
  return body?.type === "message" && body?.sender_uid === id;
}

NotificationProvider.propTypes = {
  children: PropTypes.any,
};

async function defaultHandleNotification(notification, activeChat) {
  const data = notification?.request?.content?.data;
  if (data?.type == "message" && data?.sender_uid == activeChat)
    return {
      shouldShowAlert: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
    };

  return {
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  };
}
