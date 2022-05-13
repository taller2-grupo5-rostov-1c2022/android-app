import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: "3%",
    padding: "1%",
  },
  containerCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    height: 40,
    margin: 2,
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  vPadding: {
    paddingBottom: 10,
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
  row: {
    flexDirection: "row",
  },
  formWidth: {
    width: "90%",
  },
  formWidthFlex: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  bold: {
    fontWeight: "bold",
  },
});

export default styles;
