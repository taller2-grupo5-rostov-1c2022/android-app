import { View } from "react-native";
import PropTypes from "prop-types";
import { useTheme, Text, Surface } from "react-native-paper";
import styles from "../../styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ICONS = {
  sent: "check",
  pending: "clock-outline",
  error: "close",
};

export default function ChatBubble({ name, message, right, date, icon }) {
  const theme = useTheme();
  const Container = right ? Surface : View;

  return (
    <View style={right ? { alignItems: "flex-end" } : undefined}>
      <Container
        style={[styles.chatBubble].concat(
          right
            ? [{ borderBottomRightRadius: 0 }]
            : [
                {
                  borderBottomLeftRadius: 0,
                  backgroundColor: theme.colors.primary,
                },
              ]
        )}
      >
        {name ? <Text style={styles.bold}>{name}</Text> : null}
        <Text>{message}</Text>
        <View
          style={[styles.row].concat(
            right ? [{ justifyContent: "flex-end" }] : []
          )}
        >
          <Text
            style={{
              color: theme.colors.info,
              fontSize: 10,
              marginRight: "2%",
            }}
          >
            {date ?? ""}
          </Text>
          {icon ? (
            <Icon color={theme.colors.info} size={15} name={ICONS[icon]}></Icon>
          ) : undefined}
        </View>
      </Container>
      <Container
        style={[
          styles.triangle,
          { borderBottomColor: theme.colors.background },
        ].concat(
          right
            ? []
            : [{ backgroundColor: theme.colors.primary }, styles.mirror]
        )}
      />
    </View>
  );
}

ChatBubble.propTypes = {
  name: PropTypes.string,
  message: PropTypes.string.isRequired,
  right: PropTypes.bool.isRequired,
  date: PropTypes.string,
  icon: PropTypes.oneOf(["sent", "pending", "error"]),
};
