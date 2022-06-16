import { useContext, useState } from "react";
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
      const newBalance = await updateBalance();
      toast.show(`Balance: ${newBalance}`);
      hide();
    } catch (e) {
      toast.show("Error Subscribing");
    }
  };

  const subLevels = useSubLevels();
  const userSub = subLevels?.find((sub) => sub.level === user?.sub_level);
  const newSub = subLevels?.find((sub) => sub.level === selectedLevel);

  const _hide = () => !processing && hide();

  const remainingBalance = parseFloat(balance) - parseFloat(newSub?.price) ?? 0;

  const sufficientBalance = remainingBalance > 0;

  return (
    <Dialog
      visible={selectedLevel !== undefined}
      hideDialog={_hide}
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
        ) : (
          <ScrollView>
            <Subheading>Duration: {"\t"}30 days</Subheading>
            <Subheading>
              Price: {"\t\t"}
              {newSub?.price ? `${newSub?.price} ETH + Gas` : "0 ETH"}
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
        )}
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <View style={styles.row}>
          {sufficientBalance ? (
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
