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
  const [loading, setLoading] = React.useState(false);
  const response = useSWR(url, json_fetcher);
  const Dialog = editDialog;
  const matchMutate = useMatchMutate();

  const hideDialog = async () => {
    setLoading(true);
    setDialog(null);
    if (revalidateUrl) matchMutate((str) => str.startsWith(revalidateUrl));
    await response.mutate();
    setLoading(false);
  };

  const addDialog = (data) => {
    setDialog(
      <Portal>
        <Dialog hideDialog={hideDialog} data={data} />
      </Portal>
    );
  };

  const Item = itemComponent;
  const item = ({ data }) => (
    <Item onPress={(data) => addDialog(data)} data={data} />
  );

  return (
    <View
      style={[styles.container].concat(dialog ? styles.disabled : [])}
      pointerEvents={dialog ? "none" : "auto"}
    >
      <Portal>
        <FAB
          icon="plus"
          style={styles.fab}
          disabled={dialog != null}
          onPress={() => addDialog()}
        />
      </Portal>
      <Portal>{dialog}</Portal>
      <FetchedList
        response={response}
        itemComponent={item}
        forceLoading={loading}
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
