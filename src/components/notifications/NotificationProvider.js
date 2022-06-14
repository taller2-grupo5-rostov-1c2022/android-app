import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  json_fetcher,
  NOTIFICATIONS_URL,
  fetch,
  useSWRImmutable,
} from "../../util/services";
import { addNotificationReceivedListener } from "expo-notifications";

export const NotificationContext = createContext({
  notifications: { values: [], new: false },
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
  const [notifications, setNotifications] = useState({
    values: [],
    new: false,
  });
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    if (!data && isValidating) return;
    setNotifications({
      values:
        data?.map((n) => {
          n.body = JSON.parse(n.body);
          return {
            value: n,
            date: new Date().toISOString(),
            read: !!(activeChat && isFromSameChat(n.body, activeChat)),
          };
        }) ?? [],
      new: true,
    });
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

  return (
    <NotificationContext.Provider
      value={{ notifications, clear, setActiveChat, activeChat }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function isFromSameChat(body, id) {
  return body?.type === "message" && body?.sender?.id === id;
}

NotificationProvider.propTypes = {
  children: PropTypes.any,
};
