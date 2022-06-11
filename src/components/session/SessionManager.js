import React, { useEffect, useState } from "react";
import LoadingScreen from "../account/login/LoadingScreen";
import LoginStack from "./LoginStack";
import SessionFetcher from "./SessionFetcher";
import { getDevicePushTokenAsync } from "expo-notifications";
import {
  NOTIFICATIONS_TOKEN_URL,
  fetch,
  HTTP_NOT_FOUND,
} from "../../util/services";
import { getAuth, signOut as _signOut } from "firebase/auth";

export default function SessionManager() {
  const [status, setStatus] = useState({
    loading: true,
    uid: null,
    wasLoggedOut: false,
  });

  const onAuthStateChanged = (user) => {
    if (user?.uid) {
      updateNotificationToken(status.wasLoggedOut);
      setStatus({ loading: false, uid: user.uid, wasLoggedOut: false });
    } else setStatus({ loading: false, uid: null, wasLoggedOut: true });
  };

  const signOut = async () => {
    const auth = await getAuth();
    setStatus((prev) => ({
      ...prev,
      loading: true,
    }));

    await deleteNotificationToken();

    _signOut(auth).catch();
  };

  useEffect(() => {
    const subscriber = getAuth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [status.wasLoggedOut]);
  console.log(status);
  if (status.loading) return <LoadingScreen />;
  if (!status.uid) return <LoginStack />;
  return <SessionFetcher signOut={signOut} />;
}

async function updateNotificationToken(wasLoggedOut) {
  if (!wasLoggedOut) return;

  const token = await getDevicePushTokenAsync();
  if (token.type == "web" || token.type == "ios") return;

  try {
    await fetch(NOTIFICATIONS_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token.data,
      }),
    });
  } catch (e) {
    console.log(e);
    toast.show("Failed set up notifications");
  }
}

async function deleteNotificationToken() {
  try {
    await fetch(NOTIFICATIONS_TOKEN_URL, {
      method: "DELETE",
    });
  } catch (e) {
    if (e.status == HTTP_NOT_FOUND) return;
    console.log(e);
    toast.show("Failed to remove notifications");
  }
}
