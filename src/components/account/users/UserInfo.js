import React from "react";
import Modal from "../../general/Modal";
import PropTypes from "prop-types";
import { ShapedImage } from "../../general/ShapedImage";
import { View } from "react-native";
import styles from "../../styles";
import { Title, Text, Button } from "react-native-paper";
import Chat from "./Chat";

export default function UserInfo({ modalStatus, setModalStatus }) {
  const user = modalStatus?.user;

  const [sendMsgStatus, setSendMsgStatus] = React.useState({
    visible: false,
    user,
  });

  return (
    <>
      <Modal
        title="User Information"
        visible={modalStatus.visible && !sendMsgStatus.visible}
        onDismiss={() => setModalStatus({ user, visible: false })}
      >
        <View>
          <Title style={{ marginBottom: "2%", alignSelf: "center" }}>
            {user?.name}
          </Title>
          <ShapedImage
            imageUri={user?.pfp}
            shape="circle"
            icon="account"
            size={200}
            style={{ marginBottom: "2%", alignSelf: "center" }}
          />

          <Text style={styles.userInfo}>
            <Text style={styles.bold}>Location: </Text>
            <Text>{user?.location}</Text>
          </Text>
          <Text style={styles.userInfo}>
            <Text style={styles.bold}>Interests: </Text>
            <Text>
              {user?.interests && JSON.parse(user.interests).join(", ")}
            </Text>
          </Text>
          <Button
            onPress={() => setSendMsgStatus({ visible: true, user: user })}
            icon="forum"
            mode="contained"
            style={[
              styles.button,
              { width: "50%", marginBottom: "4%", alignSelf: "center" },
            ]}
          >
            Chat
          </Button>
        </View>
      </Modal>
      <Chat status={sendMsgStatus} setStatus={setSendMsgStatus} />
    </>
  );
}

UserInfo.propTypes = {
  modalStatus: PropTypes.shape({
    visible: PropTypes.bool.isRequired,
    user: PropTypes.shape({
      id: PropTypes.any,
      name: PropTypes.string,
      location: PropTypes.string,
      interests: PropTypes.string,
      pfp: PropTypes.string,
    }),
  }).isRequired,

  setModalStatus: PropTypes.func.isRequired,
};
