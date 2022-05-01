import { Text } from "react-native-paper";
import styles from "../styles.js";
import PropTypes from "prop-types";

const firebaseErrors = {
  "auth/user-not-found": "Invalid email or password",
  "auth/email-already-in-use": "The email is already in use",
  "auth/wrong-password": "Invalid email or password",
  "auth/user-disabled": "The user account has been disabled",
  "auth/popup-closed-by-user": "",
};

function errorMsg(errorCode) {
  return firebaseErrors[errorCode] ?? "Internal error, try again later";
}

export function LoginError({ error }) {
  var text = error ? errorMsg(error?.code) : "";
  if (error?.code) console.log("Error code: " + error.code);

  return <Text style={[styles.errorText, { margin: "2%" }]}>{text}</Text>;
}

LoginError.propTypes = {
  error: PropTypes.shape({
    code: PropTypes.string,
    message: PropTypes.string,
  }),
};
