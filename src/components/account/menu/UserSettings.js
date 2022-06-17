import { List } from "react-native-paper";
import PropTypes from "prop-types";
import { useMakeArtist } from "../../../util/requests";

export default function UserSettings({ navigation, role }) {
  const makeArtist = useMakeArtist();

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
        title="Subscription"
        left={(props) => <List.Icon {...props} icon="card-plus"></List.Icon>}
        onPress={() => {
          navigation.push("ManageSubscription");
        }}
      />
      {!role || role === "listener" ? (
        <List.Item
          title="Become Artist"
          left={(props) => <List.Icon {...props} icon="music"></List.Icon>}
          onPress={makeArtist}
        />
      ) : null}
      <List.Item
        title="Other users"
        left={(props) => (
          <List.Icon {...props} icon="account-search"></List.Icon>
        )}
        onPress={() => {
          navigation.push("UserListScreen");
        }}
      />
      <List.Item
        title="Favorites"
        left={(props) => (
          <List.Icon {...props} icon="heart"></List.Icon>
        )}
        onPress={() => {
          navigation.push("FavoritesScreen");
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
