import { List } from "react-native-paper";
import PropTypes from "prop-types";

export default function UserSettings({ navigation }) {
  return (
    <List.Section>
      <List.Subheader>User settings</List.Subheader>
      <List.Item
        title="Manage my playlists..."
        left={(props) => (
          <List.Icon {...props} icon="playlist-music"></List.Icon>
        )}
        onPress={() => {
          navigation.push("ManageMyPlaylists");
        }}
      />
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
  );
}

UserSettings.propTypes = {
  role: PropTypes.string,
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
