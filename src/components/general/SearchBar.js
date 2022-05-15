import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextInput, Button } from "react-native-paper";
import { View } from "react-native";
import styles from "../styles.js";
import { VALID_SUB_LEVELS } from "../../util/general";

const options = [
  {
    name: "artist",
    label: "Artists",
  },
  {
    name: "genre",
    label: "Genres",
  },
  ...VALID_SUB_LEVELS.map((level) => ({
    ...level,
    name: "sub_level",
    value: level.value.toString(),
  })),
];

function getButtons(selected, setSelected, setDisabled, onSearch) {
  let i = 0;

  const onPress = (option) => {
    if (selected == option) return;

    setSelected(option);
    if (option.value) {
      setDisabled(true);
      onSearch(option);
    } else {
      setDisabled(false);
      onSearch({ value: "" });
    }
  };

  return (
    <View style={styles.row}>
      {options.map((option) => (
        <Button
          key={i++}
          onPress={() => onPress(option)}
          mode={selected == option ? "contained" : "outlined"}
          style={styles.searchButtons}
          compact={true}
          labelStyle={styles.searchButtonText}
        >
          {option.label}
        </Button>
      ))}
    </View>
  );
}

export default function SearchBar({ setQuery, ...rest }) {
  const [text, setText] = useState("");
  const [selected, setSelected] = useState(options[0]);
  const [focused, setFocused] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const onSearch = ({ name, value }) => {
    name = name ?? selected.name;
    value = value ?? selected.value ?? text;

    if (value) setQuery(`?${name}=${encodeURI(value)}`);
    else setQuery("");
  };

  const onKeyPress = (event) => {
    if (event.key === "Enter") onSearch();
  };

  const rightButton = () => {
    if (!text) return null;
    if (focused)
      return (
        <TextInput.Icon
          icon="magnify"
          onPress={() => onSearch()}
          forceTextInputFocus={false}
        />
      );
    return (
      <TextInput.Icon
        icon="close"
        onPress={() => {
          setText("");
          onSearch();
        }}
        forceTextInputFocus={false}
        color={(focused) => (focused ? "black" : "grey")}
      />
    );
  };

  return (
    <View {...rest}>
      <TextInput
        placeholder="Search"
        onChangeText={(text) => setText(text)}
        value={text}
        onKeyPress={onKeyPress}
        style={styles.searchBar}
        right={rightButton()}
        dense={true}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
      />
      {getButtons(selected, setSelected, setDisabled, onSearch)}
    </View>
  );
}

SearchBar.propTypes = {
  setQuery: PropTypes.func.isRequired,
  ...View.propTypes,
};
