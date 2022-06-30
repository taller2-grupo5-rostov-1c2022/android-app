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
        }}
      >
        <Subheading>{level} Account</Subheading>
        {remainingDays || remainingDays === 0 ? (
          <Text>{remainingDays} days remaining</Text>
        ) : null}
      </View>
      <Headline style={{ marginTop: "10%" }}>Your wallet</Headline>
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <Caption
          numberOfLines={1}
          ellipsizeMode="middle"
          style={{ textAlignVertical: "center", flex: 1 }}
        >
          {user?.wallet ?? ""}
        </Caption>
        <IconButton
          icon="content-copy"
          onPress={copyWallet}
          color="gray"
          style={{ marginVertical: 0 }}
        />
      </View>
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <Caption style={[styles.bold, { textAlignVertical: "center" }]}>
          Current balance:
        </Caption>
        <Caption
          numberOfLines={1}
          style={{ flex: 1, textAlignVertical: "center" }}
          ellipsizeMode="tail"
        >
          {` ${balance} `}
        </Caption>
        <Caption style={{ textAlignVertical: "center" }}>ETH</Caption>
        <IconButton
          icon="refresh"
          onPress={_updateBalance}
          color="gray"
          style={{ marginVertical: 0 }}
        />
      </View>

      <Headline style={{ marginTop: "10%", marginBottom: "5%" }}>
        Change Subscription
      </Headline>
      {subLevels?.map((sub, i) => (
        <Button
          key={i}
          mode={"outlined"}
          onPress={subscribeTo(sub?.level)}
          style={{ marginVertical: "2%" }}
        >
          <Text>{sub?.name}</Text>
        </Button>
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

ManageSubscription.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
