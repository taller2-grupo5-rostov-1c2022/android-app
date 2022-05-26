import React from "react";
import styles from "../styles.js";
import { Title, Subheading, Button } from "react-native-paper";
import { ScrollView, View } from "react-native";
import PropTypes from "prop-types";
import { UserForm } from "../account/profile/UserForm";

export default function UserCreationMenu({ onSubmit, onCancel }) {
  return (
    <View style={[styles.container, styles.containerCenter]}>
      <ScrollView contentContainerStyle={styles.containerCenter}>
        <Title
          style={[
            { textAlign: "left", alignSelf: "flex-start" },
            styles.vPadding,
          ]}
        >
          Complete your profile
        </Title>
        <Subheading
          style={[
            { textAlign: "justify", alignSelf: "flex-start" },
            styles.vPadding,
          ]}
        >
          Please, give us some extra information so you can get the best ouf of
          Spotifiuby
        </Subheading>
        <UserForm
          onSubmit={onSubmit}
          cancelButton={
            <Button
              mode="contained"
              onPress={onCancel}
              style={[styles.button, { flex: 1 }]}
            >
              Cancel
            </Button>
          }
        />
      </ScrollView>
    </View>
  );
}

UserCreationMenu.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
