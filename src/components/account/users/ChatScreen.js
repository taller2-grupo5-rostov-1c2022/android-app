import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import styles from "../../styles";
import ChatBubble from "./ChatBubble";
import {
  useSWR,
  json_fetcher,
  MESSAGES_URL,
  fetch,
} from "../../../util/services";
import FetchedList from "../../general/FetchedList";
import ChatHeader from "./ChatHeader";

const RECEIVER_QUERY_PARAM = "receiver_id";

export default function ChatScreen({ navigation, route }) {
  const { user: otherUser } = route.params;
  const [text, setText] = useState("");

  const {
    mutate,
    data: fetchedMessages,
    ...rest
  } = useSWR(`${MESSAGES_URL}${encodeURI(otherUser.id)}/`, json_fetcher, {
    // FIXME: actualizar mensajes a mano y no cada 10s
    refreshInterval: 10000,
  });
  const [messages, setMessages] = useState({});

  useEffect(() => {
    navigation.setOptions({
      header: () => <ChatHeader user={otherUser} navigation={navigation} />,
    });
  }, []);

  useEffect(() => {
    if (!fetchedMessages) return;
    let msgs = [];

    const keys = Object.keys(fetchedMessages);
    if (keys)
      keys.forEach((key) => {
        if (!key.startsWith("_")) msgs.concat(messages[key]);
      });
    fetchedMessages.forEach((m) => (msgs[`_${m.id}`] = m));

    setMessages(msgs);
  }, [fetchedMessages]);

  const bubble = ({ data: m }) => {
    const right = m.sender.id != otherUser.id;
    let date_str = undefined;
    if (right) {
      let utc = new Date(m.created_at + "Z");
      let local = localDate(utc);

      let now = localDate(new Date());
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
      return prev;
    });
    setText("");

    try {
      await sendMsg(text, otherUser.id);
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

  if (Object.keys(messages).length) rest.data = Object.values(messages);
  return (
    <View style={[styles.container]}>
      <View style={{ flex: 1 }}>
        <View style={rest.data ? { marginTop: "auto" } : { flex: 1 }}>
          <FetchedList
            response={{ ...rest }}
            itemComponent={bubble}
            emptyMessage={"No messsages"}
            scrollToBottom={true}
          />
        </View>
      </View>
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

function localDate(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
}

ChatScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      user: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        pfp: PropTypes.string,
        location: PropTypes.string,
        interests: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    setOptions: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};
