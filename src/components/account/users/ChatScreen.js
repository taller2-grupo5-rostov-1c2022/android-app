import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import styles from "../../styles";
import ChatBubble from "./ChatBubble";
import { MESSAGES_URL, fetch } from "../../../util/services";
import FetchedList from "../../general/FetchedList";
import useChatHeader from "./useChatHeader";
import { toLocalDate } from "../../../util/general";
import useMessages from "./useMessages";
import useLocalMessages from "./useLocalMessages";

const RECEIVER_QUERY_PARAM = "receiver_id";

export default function ChatScreen({ navigation, route }) {
  const { id } = route.params;
  useChatHeader(navigation, id);
  const [text, setText] = useState("");
  const { mutate, data, ...rest } = useMessages(id);
  const { addMessage, localMessages } = useLocalMessages(mutate);
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (!data) return setContent(null);
    setContent(
      localMessages
        .concat(data ?? [])
        .sort((x, y) => (x.created_at > y.created_at ? 1 : -1))
    );
  }, [localMessages, data]);

  const bubble = ({ data: m }) => {
    const right = m?.sender?.id != id;

    let utc = new Date(m?.created_at + "Z");
    let local = toLocalDate(utc);

    let now = toLocalDate(new Date());
    let date_str = `${local.toISOString().slice(11, 16)}`;
    if (now.toISOString().slice(0, 10) != local.toISOString().slice(0, 10)) {
      date_str = `${local.toISOString().slice(0, 10)} ${date_str}`;
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

    const promise = sendMsg(text, id).catch((err) => {
      toast.show("Failed to send message");
      console.error(err);
    });
    addMessage(text, promise);
    setText("");
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
          disabled={rest.error || (!data && rest.isValidating)}
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
