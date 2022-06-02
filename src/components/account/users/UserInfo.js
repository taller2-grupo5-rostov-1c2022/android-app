import { useState } from "react";
import Modal from "../../general/Modal";
import PropTypes from "prop-types";
import { ShapedImage } from "../../general/ShapedImage";
import { View } from "react-native";
import styles from "../../styles";
import { Title, Text, Button } from "react-native-paper";
import PlaylistMenuAdd from "../../playlists/PlaylistMenuAdd";

export default function UserInfo({ modalStatus, setModalStatus }) {
  const user = modalStatus?.user;

  const [sharePlaylist, setSharePlaylist] = useState(false);

  return (
    <>
      <Modal
        title="User Information"
        visible={modalStatus.visible}
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
            onPress={() => setSharePlaylist(true)}
            icon="account-plus"
            mode="contained"
            style={[
              styles.button,
              {
                marginHorizontal: "10%",
                marginVertical: "5%",
                alignSelf: "center",
              },
            ]}
            contentStyle={{ width: "100%" }}
          >
            Share Playlist
          </Button>
        </View>
      </Modal>
      <PlaylistMenuAdd
        visible={sharePlaylist}
        setVisible={setSharePlaylist}
        colabId={user?.id}
      />
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
