import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextInput, Button, IconButton } from "react-native-paper";
import { View, ScrollView } from "react-native";
import styles from "../styles.js";
import { useSubLevels } from "../../util/requests.js";

function getButtons(selected, setSelected, setDisabled, onSearch, options) {
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
    <ScrollView horizontal={true}>
      {options.map((option) => (
        <Button
          key={i++}
          onPress={() => onPress(option)}
          mode={selected.label == option.label ? "contained" : "outlined"}
          style={styles.searchButtons}
          compact={true}
          labelStyle={styles.searchButtonText}
        >
          {option.label}
        </Button>
      ))}
    </ScrollView>
  );
}

export default function SearchBar({ setQuery, ...rest }) {
  const [text, setText] = useState("");
  const [disabled, setDisabled] = useState(false);

  const subLevels = useSubLevels();
  const VALID_SUB_LEVELS = subLevels?.map(({ level, name }) => ({
    value: level,
    label: name,
  }));

  const baseOptions = [
    {
      name: "name",
      label: "Name",
    },
    {
      name: "artist",
      label: "Artists",
    },
    {
      name: "genre",
      label: "Genres",
    },
  ];
  const options = subLevels
    ? [
        ...baseOptions,
        ...VALID_SUB_LEVELS.map((level) => ({
          ...level,
          name: "sub_level",
          value: level.value.toString(),
        })),
      ]
    : baseOptions;

  const [selected, setSelected] = useState(options[0]);

  const onSearch = (
    { name, value } = { name: undefined, value: undefined }
  ) => {
    name = name ?? selected.name;
    value = value ?? selected.value ?? text;

    if (value) setQuery(`?${name}=${encodeURI(value)}`);
    else setQuery("");
  };

  const rightButton = () => {
    if (!text) return null;
    return (
      <TextInput.Icon
        icon="close"
        onPress={() => {
          setText("");
          onSearch({ value: "" });
        }}
        forceTextInputFocus={false}
        color={(focused) => (focused ? "black" : "grey")}
      />
    );
  };

  return (
    <View {...rest}>
      <View style={styles.row}>
        <TextInput
          onChangeText={(text) => setText(text)}
          value={text}
          style={styles.searchBar}
          right={rightButton()}
          dense={true}
          disabled={disabled}
          label="Search"
          returnKeyType="search"
          onSubmitEditing={() => onSearch()}
        />
        <IconButton
          icon="magnify"
          onPress={onSearch}
          style={{ alignSelf: "center" }}
          disabled={disabled}
        />
      </View>
      {getButtons(selected, setSelected, setDisabled, onSearch, options)}
    </View>
  );
}

SearchBar.propTypes = {
  setQuery: PropTypes.func.isRequired,
  ...View.propTypes,
};
