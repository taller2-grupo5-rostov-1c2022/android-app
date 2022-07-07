import { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  Button,
  Subheading,
  Text,
  Caption,
  ActivityIndicator,
} from "react-native-paper";
import { ScrollView, View, Dimensions } from "react-native";
import { SessionContext } from "../../session/SessionProvider";
import styles from "../../styles";
import { subscribe, useSubLevels } from "../../../util/requests";

export default function SubscribeDialog({ selectedLevel, hide }) {
  const [processing, setProcessing] = useState(false);

  const { user, update, balance, updateBalance } = useContext(SessionContext);

  const confirmSubscription = async () => {
    setProcessing(true);
    try {
      await subscribe(selectedLevel);
      toast.show("Successfully Subscribed");
      update();
      await updateBalance();
    } catch (e) {
      toast.show("Error Subscribing");
    }
    hide();
  };

  useEffect(() => {
    if (selectedLevel !== undefined) setProcessing(false);
  }, [selectedLevel]);

  const subLevels = useSubLevels();
  const userSub = subLevels?.find((sub) => sub.level === user?.sub_level);
  const newSub = subLevels?.find((sub) => sub.level === selectedLevel);

  const _hide = () => !processing && hide();

  const remainingBalance = parseFloat(balance) - parseFloat(newSub?.price) ?? 0;

  const sufficientBalance = remainingBalance > 0;
  const upgrading = userSub?.level < newSub?.level;

  return (
    <Dialog
      visible={selectedLevel !== undefined}
      onDismiss={_hide}
      style={{ maxHeight: Dimensions.get("window").height * 0.8 }}
    >
      <Dialog.Title>
        {userSub?.level === newSub?.level
          ? "Refresh " + userSub?.name ?? ""
          : userSub?.level > newSub?.level ?? ""
          ? "Downgrade to " + newSub?.name
          : "Upgrade to " + newSub?.name ?? ""}
      </Dialog.Title>
      <Dialog.ScrollArea>
        {processing ? (
          <ActivityIndicator
            size="large"
            style={styles.spacedActivityIndicator}
          />
        ) : upgrading ? (
          <ScrollView>
            <Subheading>Duration: {"\t"}30 days</Subheading>
            <Subheading>
              Price: {"\t\t"}
              {newSub?.price > 0 ? `${newSub?.price} ETH + Gas` : "0 ETH"}
            </Subheading>
            <Text>{"\n"}</Text>
            <Subheading>
              Current Balance: {"\t"}
              {balance} ETH
            </Subheading>
            {sufficientBalance ? (
              <>
                <Subheading>
                  After Transaction: {"\t< "}
                  {remainingBalance} ETH
                </Subheading>
                <Caption>
                  Gas price will be determined after the transaction is
                  finalized
                </Caption>
              </>
            ) : (
              <>
                <Subheading>Insufficient Balance</Subheading>
              </>
            )}
          </ScrollView>
        ) : (
          <ScrollView>
            <Subheading>
              You already have an active {userSub?.name} subscription.
            </Subheading>
            <Subheading>Wait until it expires to downgrade it.</Subheading>
          </ScrollView>
        )}
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <View style={styles.row}>
          {sufficientBalance && upgrading ? (
            <>
              <Button onPress={_hide} disabled={processing}>
                Cancel
              </Button>
              <Button onPress={confirmSubscription} disabled={processing}>
                Purchase
              </Button>
            </>
          ) : (
            <Button onPress={_hide} disabled={processing}>
              Exit
            </Button>
          )}
        </View>
      </Dialog.Actions>
    </Dialog>
  );
}

SubscribeDialog.propTypes = {
  selectedLevel: PropTypes.number,
  hide: PropTypes.func,
};
