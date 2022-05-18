import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { List, Appbar, Subheading, Button } from "react-native-paper";
import styles from "../styles.js";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { ShapedImage } from "../general/ShapedImage.js";
import PropTypes from "prop-types";
import { Portal, ActivityIndicator } from "react-native-paper";
import { FirebaseError } from "./login/FirebaseError.js";
import { useSWR, json_fetcher, webApi } from "../../util/services.js";
import AppContext from "../AppContext.js";
import ThemeSwitch from "./ThemeSwitch.js";

const ARTIST_ROLES = ["artist", "admin"];

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
        <View style={[styles.row, { margin: "4%" }]}>
          <ShapedImage
            imageUri={user?.pfp}
            onPress={() => navigation.push("MyProfileScreen")}
            size={100}
            icon="account"
            shape="circle"
          />
          <View style={{ marginLeft: "5%", justifyContent: "center", flex: 1 }}>
            <Subheading
              style={{ fontSize: 20, flexWrap: "wrap", maxHeight: 45 }}
            >
              {user?.name}
            </Subheading>
            <Button
              style={{
                alignItems: "flex-start",
                borderRadius: 5,
              }}
              labelStyle={{
                textAlign: "left",
                width: "100%",
              }}
              color="grey"
              onPress={onLogOut}
            >
              Log out
            </Button>
          </View>
        </View>
        <ArtistMenu role={role} navigation={navigation} />
        <ThemeSwitch />
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

function ArtistMenu({ role, navigation }) {
  if (!role || !ARTIST_ROLES.includes(role)) return null;

  return (
    <List.Section>
      <List.Subheader>Artist settings</List.Subheader>
      <List.Item
        title="Manage my songs..."
        left={(props) => (
          <List.Icon {...props} icon="music-box-multiple"></List.Icon>
        )}
        onPress={() => {
          navigation.push("ManageMySongs");
        }}
      />
      <List.Item
        title="Manage my albums..."
        left={(props) => <List.Icon {...props} icon="archive"></List.Icon>}
        onPress={() => {
          navigation.push("ManageMyAlbums");
        }}
      />
    </List.Section>
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

ArtistMenu.propTypes = {
  role: PropTypes.string,
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
