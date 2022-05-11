import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { List, Headline, Subheading, Button } from "react-native-paper";
import styles from "../styles.js";
import { getAuth, signOut } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { UserImage } from "./UserImage.js";
import PropTypes from "prop-types";

const ALLOWED_ROLES = ["artist", "admin"];

export default function AccountScreen() {
  const navigation = useNavigation();
  const user = getAuth()?.currentUser;
  const [role, setRole] = useState(null);

  let [{ displayName, photoURL }, setUser] = useState(user);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setUser({ ...getAuth()?.currentUser });
    });
    updateRole(setRole);
    return unsubscribe;
  }, [navigation]);

  const onLogOut = () => {
    signOut(getAuth())
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Headline>My Account</Headline>
      <View style={[styles.row, { margin: "4%" }]}>
        <UserImage
          url={photoURL}
          onPress={() => navigation.push("MyProfileScreen")}
          size={100}
        />
        <View style={{ marginLeft: "5%", justifyContent: "center", flex: 1 }}>
          <Subheading style={{ fontSize: 20, flexWrap: "wrap", maxHeight: 45 }}>
            {displayName}
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
    </SafeAreaView>
  );
}

function ArtistMenu({ role, navigation }) {
  if (!role || !ALLOWED_ROLES.includes(role)) return null;

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
