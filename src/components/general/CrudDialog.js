import React, { useEffect, useState } from "react";
import { Dialog, Button, ActivityIndicator } from "react-native-paper";
import { ScrollView, View, Dimensions } from "react-native";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import styles from "../styles";
import { ErrorDialog } from "./ErrorDialog";

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
    if (status.loading && extraFetcher) extraFetcher(data, setExtra, setStatus);
  }, [extraFetcher, status.loading]);

  useEffect(() => {
    rest.reset(defaultGen(data));
    setStatus((prev) => ({ ...prev, loading: !!extraFetcher }));
  }, [extraFetcher, data]);

  if (status.error && visible)
    return <ErrorDialog error={status.error} hideDialog={onDismiss} />;

  if (status.loading && visible) {
    return <ActivityIndicator size="large" style={styles.activityIndicator} />;
  }

  const FormDefinition = form;

  const sendRequest = async (requestSender, message) => {
    setStatus((prev) => ({ ...prev, loading: true }));
    try {
      await requestSender();
      if (message) toast.show(message);
      onDismiss();
    } catch (err) {
      setStatus({ loading: false, error: err });
    }
  };

  return (
    <Dialog
      onDismiss={onDismiss}
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
          <Button onPress={onDismiss}>Cancel</Button>
          {data?.id ? (
            <Button
              onPress={() =>
                sendRequest(
                  async () => await onDelete(data?.id),
                  `${name} deleted`
                )
              }
            >
              Delete
            </Button>
          ) : undefined}
          <Button
            onPress={handleSubmit((formData) =>
              sendRequest(
                async () => await onSave(data?.id, formData),
                `${name} saved`
              )
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
