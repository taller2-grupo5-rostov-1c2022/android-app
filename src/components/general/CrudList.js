import React, { useState, useCallback } from "react";
import { Portal, FAB } from "react-native-paper";
import styles from "../styles.js";
import { View } from "react-native";
import PropTypes from "prop-types";
import FetchedList from "./FetchedList";
import { json_fetcher, useSWR, useMatchMutate } from "../../util/services";
import CrudDialog from "./CrudDialog";

// itemComponent es el componente para cada item que recibe la prop data de cada item
// editDialog es el componente a mostrar al editar. recibe la data del elemento a editar
export default function CrudList({
  url,
  revalidateUrl,
  itemComponent,
  dialogProps,
  ...rest
}) {
  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);
  const response = useSWR(url, json_fetcher);
  const matchMutate = useMatchMutate();

  const onPress = useCallback((data) => {
    setData(data);
    setVisible(true);
  }, []);

  const onDismiss = useCallback(
    (revalidate = false) => {
      setVisible(false);
      if (revalidate && revalidateUrl)
        matchMutate((str) => str.startsWith(revalidateUrl));
      response.mutate();
    },
    [revalidateUrl]
  );

  const Item = itemComponent;
  const item = (props) => <Item onPress={(data) => onPress(data)} {...props} />;

  return (
    <View style={styles.container}>
      <FetchedList
        response={response}
        itemComponent={item}
        style={styles.listScreen}
        {...rest}
      />
      <Portal>
        <FAB
          icon="plus"
          style={styles.fab}
          disabled={visible}
          onPress={() => onPress(null)}
        />
        <CrudDialog
          {...dialogProps}
          visible={visible}
          onDismiss={onDismiss}
          data={data}
        />
      </Portal>
    </View>
  );
}

CrudList.propTypes = {
  url: PropTypes.string.isRequired,
  itemComponent: PropTypes.func.isRequired,
  revalidateUrl: PropTypes.string,
  dialogProps: PropTypes.shape({
    name: PropTypes.string.isRequired,
    defaultGen: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    form: PropTypes.any.isRequired,
  }),
};
