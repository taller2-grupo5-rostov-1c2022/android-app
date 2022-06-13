import React, { useEffect, useState } from "react";
import { Dialog, Button, ActivityIndicator } from "react-native-paper";
import { ScrollView, View, Dimensions } from "react-native";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import styles from "../styles";
import { ErrorDialog } from "./ErrorDialog";

// data: the data to populate the form (song, album or playlist data)
// visible: whether the dialog is visible or not
// onDismiss: function to call when the dialog is dismissed. Can receive
// a boolean parameter which will be set to true if changes were made
// defaultGen; function which generates the default values for the form from the data
// form: form definition to use
// onSave: function to call when the save button is pressed
// onDelete: function to call when the delete button is pressed
// extraFetcher: optional function to fetch extra data before showing the form
export default function CrudDialog({
  data,
  visible,
  onDismiss,
  name,
  defaultGen,
  onSave,
  onDelete,
  form,
  extraFetcher,
}) {
  const { handleSubmit, ...rest } = useForm({
    defaultValues: defaultGen(data),
    mode: "onChange",
  });

  const [status, setStatus] = useState({
    error: null,
    loading: !!extraFetcher,
  });

  const [extra, setExtra] = useState(null);

  useEffect(() => {
    rest.reset(defaultGen(data));
    setStatus({ error: null, loading: !!extraFetcher });
    if (extraFetcher) extraFetcher(data, setExtra, setStatus);
  }, [extraFetcher, data]);

  if (status.error)
    return (
      <ErrorDialog
        error={status.error}
        hideDialog={() => onDismiss(false)}
        visible={visible}
      />
    );

  if (status.loading && visible) {
    return <ActivityIndicator size="large" style={styles.activityIndicator} />;
  }

  const FormDefinition = form;

  // si saving es true, estamos guardando. sino borrando
  const sendRequest = async (requestSender, saving) => {
    setStatus((prev) => ({ ...prev, loading: true }));
    try {
      await requestSender();
      toast.show(`${name} ${saving ? "saved" : "deleted"}`);
      onDismiss(true);
      setStatus({ loading: false, error: null });
    } catch (err) {
      console.error(err);
      toast.show(`${name} could not be ${saving ? "saved" : "deleted"}`);
      setStatus({ loading: false, error: err });
    }
  };

  return (
    <Dialog
      onDismiss={() => onDismiss(false)}
      style={{ maxHeight: Dimensions.get("window").height * 0.8 }}
      visible={visible}
    >
      <Dialog.Title>{`${data?.id ? "Edit" : "Add"} ${name}`}</Dialog.Title>
      <Dialog.ScrollArea>
        <ScrollView style={{ marginVertical: 5 }}>
          <FormDefinition data={data} extra={extra} {...rest} />
        </ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <View style={styles.row}>
          <Button onPress={() => onDismiss(false)}>Cancel</Button>
          {data?.id ? (
            <Button
              onPress={() =>
                sendRequest(async () => await onDelete(data?.id), false)
              }
            >
              Delete
            </Button>
          ) : undefined}
          <Button
            onPress={handleSubmit((formData) =>
              sendRequest(async () => await onSave(data?.id, formData), true)
            )}
          >
            Save
          </Button>
        </View>
      </Dialog.Actions>
    </Dialog>
  );
}

CrudDialog.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
  }),
  visible: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  defaultGen: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  form: PropTypes.any.isRequired,
  extraFetcher: PropTypes.func,
};
