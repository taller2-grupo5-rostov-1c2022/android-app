import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import { ShapedImage } from "../../general/ShapedImage";
import styles from "../../styles";
import { ScrollView } from "react-native";
import ChatBubble from "./ChatBubble";

export default function ChatScreen({ navigation, route }) {
  const { user } = route.params;
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(PLACEHOLDER_MSGS);
  const scroll = useRef();

  useEffect(() => {
    navigation.setOptions({
      title: user.name,
      headerRight: () => (
        <ShapedImage
          shape="circle"
          size={40}
          icon="account"
          imageUri={user.pfp}
          style={{ marginRight: "10%" }}
        />
      ),
    });
  }, []);

  const onSend = () => {
    if (!text) return;
    setMessages([...messages, { msg: text, name: "You", right: true }]);
    setText("");
    scroll.current.scrollToEnd({ animated: true });
  };

  return (
    <View style={[styles.container, { justifyContent: "flex-end" }]}>
      <View style={{ flexDirection: "column-reverse" }}>
        <ScrollView ref={scroll}>{getMessageBubbles(messages)}</ScrollView>
      </View>
      <View style={styles.row}>
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

function getMessageBubbles(messages) {
  let i = 0;
  return messages.map((m) => (
    <ChatBubble name={m.name} message={m.msg} right={m.right} key={i++} />
  ));
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
  }).isRequired,
};

const PLACEHOLDER_MSGS = [
  {
    name: "John",
    msg: "Hello",
    right: false,
  },
  {
    name: "You",
    msg: "Holanda",
    right: true,
  },
  {
    name: "John",
    msg: ":D",
    right: false,
  },
  {
    name: "You",
    msg: "Wow",
    right: true,
  },
];
