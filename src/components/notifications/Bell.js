import React, { useState, useEffect, useContext } from "react";
import { Appbar, useTheme, Badge } from "react-native-paper";
import { View } from "react-native";
import PropTypes from "prop-types";
import { NotificationContext } from "./NotificationProvider";
import styles from "../styles";

export default function Bell({ navigation, ...rest }) {
  const [unread, setUnread] = useState(0);
  const { notifications: data } = useContext(NotificationContext);
  const theme = useTheme();

  useEffect(() => {
    setUnread(data?.values?.filter((n) => !n.read).length ?? 0);
  }, [data]);

  return (
    <View>
      <Appbar.Action
        icon="bell"
        theme={theme}
        onPress={() => {
          setUnread(0);
          navigation.push("NotificationListScreen");
        }}
        color={theme.dark ? "white" : "black"}
        {...rest}
      />
      <Badge
        visible={unread && unread > 0}
        size={18}
        style={[
          styles.notificationBadge,
          { backgroundColor: theme.colors.accent },
        ]}
      >
        {unread}
      </Badge>
    </View>
  );
}

Bell.propTypes = {
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
