import React, { useEffect, useState } from "react";
import {
  json_fetcher,
  useSWR,
  fetch,
  MY_USER_URL,
  USERS_URL,
} from "../../util/services";
import LoadingScreen from "../account/login/LoadingScreen";
import Stack from "../Stack";
import UserCreationMenu from "../session/UserCreationMenu";
import { getAuth, signOut as _signOut } from "firebase/auth";
import SessionProvider from "./SessionProvider";
const HTTP_NOT_FOUND = 404;

export default function SessionFetcher() {
  const [status, setStatus] = useState({
    loading: true,
    paused: false,
    new: false,
  });

  const response = useSWR(MY_USER_URL, json_fetcher, {
    isPaused: () => status.paused,
  });

  useEffect(() => {
    async function onNewLogin() {
      // invalidate previous user data
      let data = await response.mutate(null, { optimisticData: null });
      setStatus((prev) => ({ ...prev, loading: false }));
      if (!data?.id) return;

      if (status.new) toast.show(`Welcome to Spotifiuby, ${data.name}!`);
      else toast.show(`Welcome back, ${data.name}!`);
    }

    if (status.loading && !status.paused) onNewLogin();
  }, [status]);

  const signOut = () => {
    _signOut(getAuth()).catch();
  };

  useEffect(() => {
    if (response?.error?.status == HTTP_NOT_FOUND) {
      setStatus((prev) => ({ ...prev, paused: true }));
    }
  }, [response?.error]);

  if (
    !status.loading &&
    (response.error?.status == HTTP_NOT_FOUND || status?.paused)
  ) {
    return (
      <UserCreationMenu
        onSubmit={(data) =>
          onCreationSubmit(data, signOut, response.mutate, setStatus)
        }
        onCancel={signOut}
      />
    );
  }
  if (status.loading || !response.data) return <LoadingScreen />;

  return (
    <SessionProvider
      user={response.data}
      signOut={signOut}
      update={response.mutate}
    >
      <Stack />
    </SessionProvider>
  );
}

async function onCreationSubmit(data, signOut, mutate, setStatus) {
  setStatus((prev) => ({ ...prev, loading: true }));
  let { image, preferences, ...rest } = data;
  let body = new global.FormData();
  Object.entries(rest).forEach(([key, value]) => body.append(key, value));
  if (image) body.append("img", image, "pfp");
  if (preferences) body.append("interests", JSON.stringify(preferences));
  try {
    await fetch(USERS_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body,
    });
    setStatus({ paused: false, loading: true, new: true });
  } catch (e) {
    signOut();
    toast.show("Error creating your account, please try again later :(");
  }
}
