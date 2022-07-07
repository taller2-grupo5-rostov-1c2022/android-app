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
// async (data) => extra
export default function CrudDialog({
  data,
  visible,
  onDismiss,
  name,
  defaultGen,
  onSave,
  onDelete,
  form,
}) {
  const { handleSubmit, formState, ...rest } = useForm({
    defaultValues: defaultGen(data),
    mode: "onChange",
  });
  const [status, setStatus] = useState({
    error: null,
    loading: true,
    extra: null,
  });

  const reset = async () => {
    setStatus({ error: null, loading: true });
    try {
      const { defaultValues, extra } = await defaultGen(data);
      rest.reset(defaultValues);
      setStatus({ error: null, loading: false, extra });
    } catch (e) {
      setStatus({ error: e, loading: true, extra: null });
    }
  };

  useEffect(() => {
    if (visible) reset();
  }, [visible]);

  const _onDismiss = () => {
    setStatus({ loading: true, error: null, extra: null });
    onDismiss(false);
  };

  if (status.error)
    return (
      <ErrorDialog
        error={status.error}
        hideDialog={() => _onDismiss()}
        visible={visible}
      />
    );

  const FormDefinition = form;

  // si saving es true, estamos guardando. sino borrando
  const sendRequest = async (requestSender, saving) => {
    setStatus((prev) => ({ ...prev, loading: true }));
    try {
      await requestSender();
      toast.show(`${name} ${saving ? "saved" : "deleted"}`);
      _onDismiss();
    } catch (err) {
      console.error(err);
      toast.show(`${name} could not be ${saving ? "saved" : "deleted"}`);
      setStatus({ loading: true, error: err, extra: null });
    }
  };

  return (
    <>
      {status.loading && visible ? (
        <ActivityIndicator size="large" style={styles.activityIndicator} />
      ) : undefined}
      <Dialog
        onDismiss={_onDismiss}
        style={{ maxHeight: Dimensions.get("window").height * 0.8 }}
        visible={visible && !status.loading}
      >
        <Dialog.Title>{`${data?.id ? "Edit" : "Add"} ${name}`}</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView style={{ marginVertical: 5 }}>
            <FormDefinition
              data={data}
              extra={status.extra}
              formState={formState}
              {...rest}
            />
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <View style={styles.row}>
            <Button onPress={_onDismiss}>Cancel</Button>
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
    </>
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
