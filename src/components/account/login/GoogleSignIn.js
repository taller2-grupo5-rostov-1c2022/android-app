import * as Google from "expo-auth-session/providers/google";
import { Button } from "react-native-paper";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../../styles.js";

export function GoogleSignIn({ onSignIn }) {
  const auth = getAuth();
  const [, response, signInWithGoogle] = Google.useIdTokenAuthRequest({
    expoClientId:
      "186491690051-hk2abraqmkudskf2fvqqc7lqnps4u9jt.apps.googleusercontent.com",
    androidClientId:
      "186491690051-qvufeofgq51qk39mobagt53m2da2sea2.apps.googleusercontent.com",
    webClientId:
      "186491690051-i9dh8a8phlea0521ibilvp8ha6b8nr03.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type != "success") return;

    onSignIn(async () => {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      await signInWithCredential(auth, credential);
    });
  }, [response]);

  return (
    <Button onPress={() => signInWithGoogle()} style={styles.button}>
      Sign in with Google
    </Button>
  );
}

GoogleSignIn.propTypes = {
  onSignIn: PropTypes.func.isRequired,
};
