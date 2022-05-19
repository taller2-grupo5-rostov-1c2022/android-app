import { List } from "react-native-paper";
import PropTypes from "prop-types";

const PlaylistItem = ({ data, onPress }) => (
  <List.Item
    title={data.name}
    description={data.description}
    onPress={onPress ? () => onPress(data) : undefined}
  />
);

PlaylistItem.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func,
};

export default PlaylistItem;
