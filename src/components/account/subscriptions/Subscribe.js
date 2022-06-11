import React from "react";
import PropTypes from "prop-types";
import { Button, Text } from "react-native-paper";
import { View } from "react-native";
import { subscribe, useSubLevels } from "../../../util/requests";

export default function Subscribe() {
  const subLevels = useSubLevels();

  const subscribeTo = (level) => () => {
    // Fixme
    // confirmation dialog that tells u ur current sublevel
    try {
      console.log("Subscribing to ", level);
      subscribe(level).then(() => {
        toast.show("Subscription Success");
      });
    } catch (e) {
      console.log("Error subscribing");
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
      {subLevels?.map((sub, i) => (
        <Button key={i} mode={"outlined"} onPress={subscribeTo(sub?.level)}>
          <Text>{sub?.name}</Text>
        </Button>
      ))}
    </View>
  );
}

Subscribe.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};
