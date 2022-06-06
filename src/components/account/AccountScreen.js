import { useContext } from "react";
import { View, ScrollView } from "react-native";
import { Appbar, List } from "react-native-paper";
import styles from "../styles.js";
import { useNavigation } from "@react-navigation/native";
import { AudioContext } from "../general/AudioProvider.js";
import ThemeSwitch from "./menu/ThemeSwitch.js";
import ArtistSettings from "./menu/ArtistSettings";
import UserHeader from "./menu/UserHeader.js";
import UserSettings from "./menu/UserSettings.js";
import { SessionContext } from "../session/SessionProvider";

export default function AccountScreen() {
  const audio = useContext(AudioContext);
  const session = useContext(SessionContext);
  const navigation = useNavigation();

  const onLogOut = () => {
    audio.stop();
    session.signOut();
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar>
        <Appbar.Content title="More" />
      </Appbar>

      <ScrollView style={styles.container}>
        <UserHeader
          user={session.user}
          navigation={navigation}
          onLogOut={onLogOut}
        />
        <UserSettings navigation={navigation} />
        <ArtistSettings role={session.role} navigation={navigation} />
        <ThemeSwitch />
        <List.Section>
          <List.Subheader>Live Streaming</List.Subheader>
          <List.Item
            title={"Live streams"}
            onPress={() => navigation.push("LiveScreen")}
            left={(props) => (
              <List.Icon {...props} icon={"antenna"}></List.Icon>
            )}
          />
        </List.Section>
      </ScrollView>
    </View>
  );
}
