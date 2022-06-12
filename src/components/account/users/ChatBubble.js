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
      </Container>
      <View
        style={
          right ? { flexDirection: "row-reverse" } : { flexDirection: "row" }
        }
      >
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
        <View
          style={[
            { marginHorizontal: 3, marginBottom: 5, marginTop: 2 },
          ].concat(
            right ? { flexDirection: "row-reverse" } : { flexDirection: "row" }
          )}
        >
          {icon ? (
            <Icon
              color={theme.colors.info}
              size={12}
              name={ICONS[icon]}
              style={[{ alignSelf: "center" }].concat(
                right ? { marginLeft: 5 } : { marginRight: 5 }
              )}
            />
          ) : undefined}
          <Text
            style={{
              color: theme.colors.info,
              fontSize: 10,
            }}
          >
            {date ?? ""}
          </Text>
        </View>
      </View>
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
