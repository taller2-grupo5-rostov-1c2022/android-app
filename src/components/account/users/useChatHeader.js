import { useEffect } from "react";
import { ActivityIndicator } from "react-native-paper";
import { ShapedImage } from "../../general/ShapedImage";
import { useSWR, json_fetcher, USERS_URL } from "../../../util/services";
import styles from "../../styles";

export default function useChatHeader(navigation, user_id) {
  const userResponse = useSWR(`${USERS_URL}/${user_id}`, json_fetcher);
  useEffect(() => {
    navigation.setOptions(getHeaderOptions(userResponse));
  }, [userResponse]);
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
