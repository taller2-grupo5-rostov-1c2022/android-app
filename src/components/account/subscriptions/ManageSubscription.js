import { useContext, useState } from "react";
import { SessionContext } from "../../session/SessionProvider";
import PropTypes from "prop-types";
import {
  Button,
  Headline,
  Subheading,
  Text,
  Caption,
  IconButton,
} from "react-native-paper";
import { View } from "react-native";
import { setStringAsync } from "expo-clipboard";
import { useSubLevels } from "../../../util/requests";
import SubscribeDialog from "./SubscribeDialog";
import styles from "../../styles";
import Portal from "../../general/NavigationAwarePortal";
import SubIcon from "../../general/SubIcon";

const getRemainingDays = (str_date) => {
  if (!str_date) return null;
  const diff = new Date(str_date) - new Date();
  const totalDays = Math.floor(diff / (1000 * 3600 * 24));
  return totalDays;
};

export default function ManageSubscription() {
  const subLevels = useSubLevels();
  const [selectedLevel, setSelectedLevel] = useState();

  const { user, balance, updateBalance } = useContext(SessionContext);

  const remainingDays = getRemainingDays(user?.sub_expires);
  const level =
    subLevels?.find((sub) => sub.level === user?.sub_level)?.name ?? "- -";

  const subscribeTo = (level) => () => setSelectedLevel(level);

  const copyWallet = async () => {
    try {
      await setStringAsync(user?.wallet ?? "");
      toast.show("Wallet copied");
    } catch (e) {
      toast.show("Error copying wallet");
      console.error(e);
    }
  };

  const _updateBalance = async () => {
    try {
      await updateBalance();
      toast.show("Balance updated");
    } catch (e) {
      toast.show("Error updating balance");
      console.error(e);
    }
  };

  return (
    <View
      style={{
        display: "flex",
        gap: 20,
        margin: 30,
      }}
    >
      <Headline>Current Subscription</Headline>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 15,
        }}
      >
        <Subheading>{level} Account</Subheading>
        {remainingDays || remainingDays === 0 ? (
          <Text>{remainingDays} days remaining</Text>
        ) : null}
      </View>
      <InfoButton
        title="Your wallet"
        text={user?.wallet}
        icon="content-copy"
        onPress={copyWallet}
        ellipsizeMode="middle"
      />
      <InfoButton
        title="Current balance"
        text={balance}
        icon="refresh"
        right="ETH"
        onPress={_updateBalance}
        ellipsizeMode="tail"
      />
      <Headline style={{ marginTop: "10%", marginBottom: "5%" }}>
        Change Subscription
      </Headline>
      {subLevels.map((sub, i) => (
        <View key={i} style={[styles.row, styles.containerCenter]}>
          <SubIcon subLevel={sub.level} style={{ marginRight: 15 }} />
          <Button
            mode={"outlined"}
            onPress={subscribeTo(sub?.level)}
            style={{ marginVertical: 10, flex: 1, paddingVertical: 5 }}
            disabled={sub?.level === user?.sub_level}
          >
            {sub?.name}
          </Button>
        </View>
      ))}

      <Portal>
        <SubscribeDialog
          selectedLevel={selectedLevel}
          hide={() => setSelectedLevel(undefined)}
        />
      </Portal>
    </View>
  );
}

const InfoButton = ({ title, text, icon, right, onPress, ellipsizeMode }) => (
  <View
    style={[styles.row, { justifyContent: "space-between", marginVertical: 2 }]}
  >
    <Caption style={[styles.bold, { textAlignVertical: "center" }]}>
      {title}:
    </Caption>
    <Caption
      numberOfLines={1}
      style={{ flex: 1, textAlignVertical: "center" }}
      ellipsizeMode={ellipsizeMode}
    >
      {` ${text ?? ""} `}
    </Caption>
    <Caption style={{ textAlignVertical: "center" }}>{right}</Caption>
    <IconButton
      icon={icon}
      onPress={onPress}
      color="gray"
      style={{ marginVertical: 0 }}
    />
  </View>
);

ManageSubscription.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

InfoButton.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  icon: PropTypes.string.isRequired,
  right: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  ellipsizeMode: PropTypes.string.isRequired,
};
