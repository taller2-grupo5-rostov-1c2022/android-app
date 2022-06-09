import { Dialog, Button, Subheading } from "react-native-paper";
import PropTypes from "prop-types";

export function ErrorDialog({ error, hideDialog, ...restProps }) {
  return (
    <Dialog onDismiss={hideDialog} {...restProps}>
      <Dialog.Title>Error</Dialog.Title>
      <Dialog.Content>
        <Subheading>{error?.message}</Subheading>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={hideDialog}>Ok</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

ErrorDialog.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  hideDialog: PropTypes.func,
};
