import { useContext, useState } from "react";
import { SessionContext } from "../../session/SessionProvider";
import PropTypes from "prop-types";
import { Button, Headline, Portal, Subheading, Text } from "react-native-paper";
import { View } from "react-native";
import { useSubLevels } from "../../../util/requests";
import SubscribeDialog from "./SubscribeDialog";

const getRemainingDays = (str_date) => {
  if (!str_date) return null;
  const diff = new Date(str_date) - new Date();
  const totalDays = Math.floor(diff / (1000 * 3600 * 24));
  return totalDays;
};

export default function ManageSubscription() {
  const subLevels = useSubLevels();
  const [selectedLevel, setSelectedLevel] = useState();

  const { user, balance } = useContext(SessionContext);

  const remainingDays = getRemainingDays(user?.sub_expires);
  const level =
    subLevels?.find((sub) => sub.level === user?.sub_level)?.name ?? "- -";

  const subscribeTo = (level) => () => setSelectedLevel(level);

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
      <Subheading>
        Current balance: {"\t"}
        {balance} ETH
      </Subheading>
      <Headline>Change Subscription</Headline>
      {subLevels?.map((sub, i) => (
        <Button key={i} mode={"outlined"} onPress={subscribeTo(sub?.level)}>
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
