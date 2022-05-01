import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: "2%",
    padding: 4,
  },
  containerCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderWidth: 1,
    width: "80%",
    margin: 1,
  },
  button: {
    height: 40,
    margin: 1,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  activityIndicator: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  bigLogo: {
    width: 200,
    height: 200,
    resizeMode: "stretch",
  },
  errorText: {
    color: "#b00020",
  },
  formTextInput: {
    width: "80%",
    margin: "2%",
  },
});

export default styles;

// Hacer algo para que cuando dialog no es null se ponga gris lo de atras
