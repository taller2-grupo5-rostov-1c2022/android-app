import { useState, useEffect, useRef } from "react";
import { setNotificationHandler } from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import handleNotification from "../../notifications/notificationHandler";
import {
  useSWRImmutable,
  json_fetcher,
  MESSAGES_URL,
} from "../../../util/services";

const ID_QUERY_PARAMETER = "?id_start=";
const CHAT_PREFIX_KEY = "chat_";

export default function useMessages(user_id) {
  const [query, setQuery] = useState(null);
  const [cached, setCached] = useState([]);
  const [messages, setMessages] = useState(null);
  const {
    data,
    mutate: _mutate,
    ...rest
  } = useSWRImmutable(
    `${MESSAGES_URL}${encodeURI(user_id)}/${query}`,
    json_fetcher,
    {
      isPaused: () => query == null,
      onSuccess: (data) => console.log(data),
    }
  );
  const componentWillUnmount = useRef(false);

  const mutate = async () => {
    const response = await _mutate();
    if (!response.data || response.data.length == 0) return response;

    const max = Math.max(...response.data.map((m) => m.id)) + 1;
    setQuery(`${ID_QUERY_PARAMETER}${max}`);
    return response;
  };

  useEffect(() => {
    get_cached();
    setNotificationHandler({
      handleNotification: async (n) => {
        const data = n?.request?.content?.data;

        if (data?.type != "message" || data?.sender?.id != user_id)
          return handleNotification(n);

        await mutate();
        return {
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        };
      },
    });
    return () => {
      componentWillUnmount.current = true;
      setNotificationHandler({
        handleNotification,
      });
    };
  }, []);

  useEffect(() => {
    if (data) setMessages(cached.concat(data));
    else if (cached.length > 0) setMessages(cached);
    else setMessages(null);
  }, [data, cached]);

  useEffect(() => {
    if (query != null) mutate();
  }, [query]);

  useEffect(() => {
    return () => {
      if (componentWillUnmount.current) write_cached();
    };
  }, [messages]);

  async function get_cached() {
    let stored = null;
    try {
      stored = await AsyncStorage.getItem(`${CHAT_PREFIX_KEY}${user_id}`);
    } catch (e) {
      console.error(e);
      toast.show("Failed to fetch cached chats");
    }

    const msgs = stored && Object.values(JSON.parse(stored));
    let max = 1;
    if (msgs?.length > 0) {
      setCached(msgs);
      max = Math.max(...msgs.map((m) => m.id)) + 1;
    }

    setQuery(`${ID_QUERY_PARAMETER}${max}`);
  }

  async function write_cached() {
    const msgs = Object.fromEntries(messages.map((m) => [m.id, m]));
    await AsyncStorage.setItem(
      `${CHAT_PREFIX_KEY}${user_id}`,
      JSON.stringify(msgs)
    );
  }

  return { data: messages, mutate, ...rest };
}
