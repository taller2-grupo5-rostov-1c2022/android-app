import { useContext, useState } from "react";
import { SessionContext } from "../../session/SessionProvider";
import PropTypes from "prop-types";
import { Dialog, Button, Headline, Subheading, Text } from "react-native-paper";
import { ScrollView, View, Dimensions } from "react-native";
import styles from "../../styles";
import { subscribe, useSubLevels } from "../../../util/requests";

const currentBalance = "0.0002";

export default function SubscribeDialog({ selectedLevel, hide }) {
  const [processing, setProcessing] = useState(false);

  const { user, update } = useContext(SessionContext);

  const confirmSubscription = async () => {
    setProcessing(true);
    try {
      await subscribe(selectedLevel);
      toast.show("Successfully Subscribed");
      update();
    } catch (e) {
      toast.show("Error Subscribing");
    }
    setProcessing(false);
  };

  const subLevels = useSubLevels();
  const userSub = subLevels?.find((sub) => sub.level === user?.sub_level);
  const newSub = subLevels?.find((sub) => sub.level === selectedLevel);

  const _hide = () => !processing && hide();

  //const sufficientBalance = true;

  return (
    <Dialog
      visible={selectedLevel !== undefined}
      hideDialog={_hide}
      onDismiss={_hide}
      style={{ maxHeight: Dimensions.get("window").height * 0.8 }}
    >
      <Dialog.Title>Update Subscription</Dialog.Title>
      <Dialog.ScrollArea>
        <ScrollView>
          {userSub?.level === newSub?.level ? (
            <Headline>Refresh {userSub?.name}</Headline>
          ) : userSub?.level > newSub?.level ? (
            <Headline>Downgrade to {newSub?.name}</Headline>
          ) : (
            <Headline>Upgrade to {newSub?.name}</Headline>
          )}
          <Subheading>Duration: 30 days</Subheading>
          <Subheading>Price: {newSub?.price}</Subheading>
          <Text>{"\n"}</Text>
          <Subheading>
            Current Balance: {"\t"}
            {currentBalance}
          </Subheading>
          <Subheading>After Transaction: {"\t"}0.0001</Subheading>
        </ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <View style={styles.row}>
          <Button onPress={_hide} disabled={processing}>
            Cancel
          </Button>
          <Button onPress={confirmSubscription} disabled={processing}>
            Purchase
          </Button>
        </View>
      </Dialog.Actions>
    </Dialog>
  );
}

SubscribeDialog.propTypes = {
  selectedLevel: PropTypes.number,
  hide: PropTypes.func,
};
