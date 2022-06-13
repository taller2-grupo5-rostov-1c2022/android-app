import React from "react";
import { Portal, FAB } from "react-native-paper";
import styles from "../styles.js";
import { View } from "react-native";
import PropTypes from "prop-types";
import FetchedList from "./FetchedList";
import { json_fetcher, useSWR, useMatchMutate } from "../../util/services";

// itemComponent es el componente para cada item que recibe la prop data de cada item
// editDialog es el componente a mostrar al editar. recibe la data del elemento a editar
export default function CrudList({
  url,
  editDialog,
  itemComponent,
  revalidateUrl,
  ...rest
}) {
  const [dialog, setDialog] = React.useState(null);
  const [disabled, setDisabled] = React.useState(false);
  const response = useSWR(url, json_fetcher);
  const Dialog = editDialog;
  const matchMutate = useMatchMutate();

  const hideDialog = async () => {
    setDialog(<Dialog visible="false" />);
    setDialog(null);
    setDisabled(false);
    if (revalidateUrl)
      await matchMutate((str) => str.startsWith(revalidateUrl));
    await response.mutate();
  };

  const onPress = (data) => {
    setDialog(<Dialog hideDialog={hideDialog} data={data} visible="true" />);
    setDisabled(true);
  };

  const Item = itemComponent;
  const item = ({ data }) => (
    <Item onPress={(data) => onPress(data)} data={data} />
  );

  return (
    <View style={styles.container}>
      <Portal>
        <FAB
          icon="plus"
          style={styles.fab}
          disabled={disabled}
          onPress={() => onPress(null)}
        />
        {dialog}
      </Portal>
      <FetchedList
        response={response}
        itemComponent={item}
        style={styles.listScreen}
        {...rest}
      />
    </View>
  );
}

CrudList.propTypes = {
  url: PropTypes.string.isRequired,
  editDialog: PropTypes.any.isRequired,
  itemComponent: PropTypes.func.isRequired,
  revalidateUrl: PropTypes.string,
};
