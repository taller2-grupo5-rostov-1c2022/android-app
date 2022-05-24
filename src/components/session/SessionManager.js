import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import LoadingScreen from "../account/login/LoadingScreen";
import LoginStack from "./LoginStack";
import SessionFetcher from "./SessionFetcher";

export default function SessionManager() {
  const [status, setStatus] = useState({
    loading: true,
    uid: null,
  });

  const onAuthStateChanged = (user) => {
    if (user?.uid) setStatus({ loading: false, uid: user.uid });
    else setStatus({ loading: false, uid: null });
  };

  useEffect(() => {
    const subscriber = getAuth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (status.loading) return <LoadingScreen />;
  if (!status.uid) return <LoginStack />;
  return <SessionFetcher />;
}
