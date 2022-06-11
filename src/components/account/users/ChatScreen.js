import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { ActivityIndicator, IconButton, TextInput } from "react-native-paper";
import styles from "../../styles";
import ChatBubble from "./ChatBubble";
import {
  useSWR,
  json_fetcher,
  MESSAGES_URL,
  USERS_URL,
  fetch,
} from "../../../util/services";
import FetchedList from "../../general/FetchedList";
import { ShapedImage } from "../../general/ShapedImage";
import { toLocalDate } from "../../../util/general";

const RECEIVER_QUERY_PARAM = "receiver_id";

export default function ChatScreen({ navigation, route }) {
  const { id } = route.params;
  const userResponse = useSWR(`${USERS_URL}/${id}`, json_fetcher);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState({});
  const [content, setContent] = useState(null);
  const {
    mutate,
    data: fetchedMessages,
    ...rest
  } = useSWR(`${MESSAGES_URL}${encodeURI(id)}/`, json_fetcher, {
    // FIXME: actualizar mensajes a mano y no cada 10s
    refreshInterval: 10000,
  });

  useEffect(() => {
    navigation.setOptions(getHeaderOptions(userResponse));
  }, [userResponse]);

  useEffect(() => {
    if (!fetchedMessages) return;
    let msgs = [];

    const keys = Object.keys(messages);
    if (keys)
      keys.forEach((key) => {
        if (!key.startsWith("_")) msgs.concat(messages[key]);
      });
    fetchedMessages.forEach((m) => (msgs[`_${m.id}`] = m));

    setMessages(msgs);
  }, [fetchedMessages]);

  useEffect(() => {
    if (!fetchedMessages) setContent(null);
    else setContent(Object.values(messages));
  }, [messages]);

  const bubble = ({ data: m }) => {
    const right = m.sender.id != id;
    let date_str = undefined;
    if (right) {
      let utc = new Date(m.created_at + "Z");
      let local = toLocalDate(utc);

      let now = toLocalDate(new Date());
      date_str = `${local.toISOString().slice(11, 16)}`;
      if (now.toISOString().slice(0, 10) != local.toISOString().slice(0, 10)) {
        date_str = `${local.toISOString().slice(0, 10)} ${date_str}`;
      }
    }

    return (
      <ChatBubble
        message={m.text}
        right={right}
        date={date_str}
        icon={right ? m.status ?? "sent" : undefined}
      />
    );
  };

  const onSend = async () => {
    if (!text) return;

    const date = new Date();
    const optimistic_msg = {
      text: text,
      sender: {
        id: null,
      },
      created_at: date.toISOString().slice(0, -1),
      status: "pending",
    };

    setMessages((prev) => {
      prev[date.getTime()] = optimistic_msg;
      return { ...prev };
    });
    setText("");

    try {
      await sendMsg(text, id);
    } catch (err) {
      toast.show("Failed to send message");
      console.error(err);
      setMessages((prev) => {
        prev[date.getTime()].status = "error";
        return { ...prev };
      });
      return;
    }

    await mutate();
    setMessages((prev) => {
      delete prev[date.getTime()];
      return prev;
    });
  };

  return (
    <View style={[styles.container]}>
      <FetchedList
        response={{ ...rest, data: content }}
        itemComponent={bubble}
        emptyMessage={"No messsages"}
        scrollToBottom={true}
        style={{ transform: [{ scaleY: -1 }] }}
        contentContainerStyle={{ transform: [{ scaleY: -1 }] }}
      />
      <View style={[styles.row]}>
        <TextInput
          mode="outlined"
          onChangeText={(text) => setText(text)}
          value={text}
          dense={true}
          placeholder="Message"
          multiline={true}
          style={styles.chatInput}
        ></TextInput>
        <IconButton
          icon="send"
          style={{ alignSelf: "center" }}
          onPress={onSend}
          disabled={!content}
        ></IconButton>
      </View>
    </View>
  );
}

async function sendMsg(msg, receiver_id) {
  await fetch(
    `${MESSAGES_URL}?${RECEIVER_QUERY_PARAM}=${encodeURI(receiver_id)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        text: msg,
      }),
    }
  );
}

function getHeaderOptions(userResponse) {
  if (!userResponse?.data || userResponse?.isValidating)
    return {
      headerShown: true,
      left: <ActivityIndicator style={styles.activityIndicator} />,
    };

  return {
    title: userResponse?.data?.name,
    headerShown: true,
    left: (
      <ShapedImage
        shape="circle"
        size={40}
        icon="account"
        imageUri={userResponse?.data?.pfp}
        style={{ backgroundColor: "#F8F8FF" }}
      />
    ),
  };
}

ChatScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    setOptions: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
