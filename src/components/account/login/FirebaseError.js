import { Text } from "react-native-paper";
import { useTheme } from "react-native-paper";
import PropTypes from "prop-types";

const firebaseErrors = {
  "auth/user-not-found": "Invalid email or password",
  "auth/email-already-in-use": "The email is already in use",
  "auth/wrong-password": "Invalid email or password",
  "auth/user-disabled": "The user account has been disabled",
  "auth/weak-password": "The password is too weak",
  "auth/invalid-email": "The email is invalid",
  "auth/popup-closed-by-user": "",
  "auth/requires-recent-login":
    "Session expired. Please log in again\nto change your email or password",
};

function errorMsg(errorCode) {
  return (
    firebaseErrors[errorCode] ??
    `Internal error, try again later\nError code: ${errorCode}`
  );
}

export function FirebaseError({ error, style }) {
  let text = error ? errorMsg(error?.code) : "";
  let theme = useTheme();
  if (error && !error.code) console.error(error);

  return (
    <Text
      style={[{ color: theme.colors.error, margin: "2%" }].concat(style ?? [])}
    >
      {text}
    </Text>
  );
}

FirebaseError.propTypes = {
  error: PropTypes.shape({
    code: PropTypes.string,
    message: PropTypes.string,
  }),
  style: PropTypes.any,
};
