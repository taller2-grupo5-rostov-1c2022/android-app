import { List } from "react-native-paper";
import { ARTIST_ROLES } from "../../../util/general";
import PropTypes from "prop-types";

export default function ArtistSettings({ role, navigation }) {
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
      <List.Item
        title="Manage my playlists..."
        left={(props) => (
          <List.Icon {...props} icon="playlist-music"></List.Icon>
        )}
        onPress={() => {
          navigation.push("ManageMyPlaylists");
        }}
      />
    </List.Section>
  );
}

ArtistSettings.propTypes = {
  role: PropTypes.string,
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
