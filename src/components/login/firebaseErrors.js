const firebaseErrors = {
  "auth/user-not-found": "Invalid email or password",
  "auth/email-already-in-use": "The email is already in use",
  "auth/wrong-password": "Invalid email or password",
  "auth/user-disabled": "The user account has been disabled",
  "auth/popup-closed-by-user": "",
}; // list of firebase error codes to alternate error messages

export default function errorMsg(errorCode) {
  return firebaseErrors[errorCode] ?? "Internal error, try again later";
}
