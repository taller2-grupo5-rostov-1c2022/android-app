import { Button, Subheading, useTheme } from "react-native-paper";
import { ShapedImage } from "../../general/ShapedImage.js";
import { View } from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../../styles.js";
import { useSubLevels } from "../../../util/requests.js";

export default function UserHeader({ navigation, user, onLogOut }) {
  const subLevels = useSubLevels();
  const theme = useTheme();

  const accountLevel =
    subLevels?.find((sub) => sub.level === user?.sub_level)?.name ?? "";

  return (
    <View style={[styles.row, { margin: "4%" }]}>
      <ShapedImage
        imageUri={user?.pfp}
        onPress={() => navigation.push("MyProfileScreen")}
        size={100}
        icon="account"
        shape="circle"
      />
      <View style={{ marginLeft: "5%", justifyContent: "center", flex: 1 }}>
        <Subheading style={{ fontSize: 20, flexWrap: "wrap", maxHeight: 45 }}>
          {user?.name}
        </Subheading>
        <View style={[styles.row, styles.containerCenter]}>
          <Icon name="account" color={theme.colors.info} size={16} />
          <Subheading
            style={{
              fontSize: 15,
              flexWrap: "wrap",
              maxHeight: 45,
              flex: 1,
              marginLeft: 10,
            }}
          >
            {accountLevel} Account
          </Subheading>
        </View>
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
  );
}

UserHeader.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    pfp: PropTypes.string,
    sub_level: PropTypes.number,
  }),
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  onLogOut: PropTypes.func.isRequired,
};
