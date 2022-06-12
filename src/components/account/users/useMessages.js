import { useSWR, json_fetcher, MESSAGES_URL } from "../../../util/services";
//import AsyncStorage from "@react-native-async-storage/async-storage";
export default function useMessages(user_id) {
  const response = useSWR(
    `${MESSAGES_URL}${encodeURI(user_id)}/`,
    json_fetcher,
    {
      // FIXME: actualizar mensajes a mano y no cada 10s
      refreshInterval: 10000,
    }
  );

  return response;
}
