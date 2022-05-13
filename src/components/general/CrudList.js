import React from "react";
import { Portal, FAB } from "react-native-paper";
import styles from "../styles.js";
import { SafeAreaView } from "react-native-safe-area-context";
import PropTypes from "prop-types";
import FetchedList from "./FetchedList";
import { webApi, json_fetcher, useSWR } from "../../util/services";

// propGen es una funcion que recibe la data de un elemento del response y devuelva las props del item de la lista
// editDialog es el componente a mostrar al editar. recibe la data del elemento a editar
export default function CrudList({ url, editDialog, propGen }) {
  const [dialog, setDialog] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const response = useSWR(`${webApi}${url}`, json_fetcher);
  const Dialog = editDialog;

  const hideDialog = async () => {
    setLoading(true);
    setDialog(null);
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

  return (
    <SafeAreaView
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
        onPress={(data) => addDialog(data)}
        propGen={propGen}
        forceLoading={loading}
      />
    </SafeAreaView>
  );
}

CrudList.propTypes = {
  url: PropTypes.string.isRequired,
  editDialog: PropTypes.any.isRequired,
  propGen: PropTypes.func.isRequired,
};
