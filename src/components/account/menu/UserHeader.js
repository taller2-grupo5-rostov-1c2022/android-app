import { Button, Subheading } from "react-native-paper";
import { ShapedImage } from "../../general/ShapedImage.js";
import { View } from "react-native";
import styles from "../../styles.js";
import PropTypes from "prop-types";

export default function UserHeader({ navigation, user, onLogOut }) {
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
  }),
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  onLogOut: PropTypes.func.isRequired,
};
