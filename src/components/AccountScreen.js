import React from "react";
import { View } from "react-native";
import { List, IconButton, Headline, Subheading } from "react-native-paper";
import styles from "./styles.js";
import { getAuth, signOut } from "firebase/auth";
import ExternalView from "./ExternalView.js";
import { useNavigation } from "@react-navigation/native";

export default function AccountScreen() {
  const auth = getAuth();
  const navigation = useNavigation();

  const onLogOut = () => {
    signOut(auth)
      .then(() => {
        console.log("log out");
        navigation.replace("Login");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <ExternalView style={styles.container}>
      <Headline>My Account</Headline>
      <View style={{ flexDirection: "row", margin: "4%" }}>
        <View style={{ justifyContent: "center", flex: 9 }}>
          <Subheading>Logged in as {auth?.currentUser?.displayName}</Subheading>
        </View>
        <View style={{ flex: 1 }}>
          <IconButton
            icon="logout"
            onPress={onLogOut}
            accessibilityLabel="Logout"
          />
        </View>
      </View>
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
    </ExternalView>
  );
}
