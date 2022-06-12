import AsyncStorage from "@react-native-async-storage/async-storage";

export const CHAT_PREFIX_KEY = "chat_";

export default function handleNotification(n) {
  const data = n?.request?.content?.data;

  if (data?.type != "message") return;

  update_message_cache(data);
  return {
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  };
}

async function update_message_cache(data) {
  let stored = null;
  try {
    stored = await AsyncStorage.getItem(`${CHAT_PREFIX_KEY}${data.sender.id}`);
  } catch (e) {
    console.error(e);
    toast.show("Failed to fetch cached chats");
    return;
  }

  const messages = stored ? JSON.parse(stored) : {};

  messages[data.id] = data;

  await AsyncStorage.setItem(
    `${CHAT_PREFIX_KEY}${data.sender.id}`,
    JSON.stringify(messages)
  );
}
