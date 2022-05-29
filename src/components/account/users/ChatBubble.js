import { View } from "react-native";
import PropTypes from "prop-types";
import { useTheme, Text, Surface } from "react-native-paper";
import styles from "../../styles";

export default function ChatBubble({ name, message, right }) {
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
        <Text style={styles.bold}>{name}</Text>
        <Text>{message}</Text>
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
  name: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  right: PropTypes.bool.isRequired,
};
