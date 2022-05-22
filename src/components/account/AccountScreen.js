import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Appbar } from "react-native-paper";
import styles from "../styles.js";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { Portal, ActivityIndicator, List } from "react-native-paper";
import { FirebaseError } from "./login/FirebaseError.js";
import { useSWR, json_fetcher, webApi } from "../../util/services.js";
import AppContext from "../AppContext.js";
import ThemeSwitch from "./menu/ThemeSwitch.js";
import ArtistSettings from "./menu/ArtistSettings";
import UserHeader from "./menu/UserHeader.js";

export default function AccountScreen() {
  const navigation = useNavigation();
  const [role, setRole] = useState(null);
  const context = React.useContext(AppContext);

  let {
    data: user,
    error,
    isValidating,
  } = useSWR(webApi + "/songs/my_user/", json_fetcher);
  const loading = isValidating && !user && !error;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      updateRole(setRole);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    updateRole(setRole);
  });

  const onLogOut = () => {
    context.setStop(true);
    navigation.replace("SessionManager");
    signOut(getAuth()).catch();
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar>
        <Appbar.Content title="More" />
      </Appbar>

      <View style={styles.container}>
        <UserHeader user={user} navigation={navigation} onLogOut={onLogOut} />
        <ArtistSettings role={role} navigation={navigation} />
        <ThemeSwitch />
        <List.Section>
          <List.Subheader>Users</List.Subheader>
          <List.Item
            title="Other users..."
            left={(props) => (
              <List.Icon {...props} icon="account-search"></List.Icon>
            )}
            onPress={() => {
              navigation.push("UserListScreen");
            }}
          />
        </List.Section>
        <Portal>
          {loading ? (
            <ActivityIndicator size="large" style={styles.activityIndicator} />
          ) : null}
        </Portal>
        <FirebaseError error={error} style={{ textAlign: "center" }} />
      </View>
    </View>
  );
}

async function updateRole(setRole) {
  try {
    const user = getAuth()?.currentUser;
    const token = await user?.getIdTokenResult(false);
    setRole(token.claims.role);
  } catch (e) {
    console.error("Could not get user role: ", e);
  }
}
