import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: "3%",
    padding: "1%",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalMargin: {
    marginHorizontal: "2%",
  },
  containerWithPlayer: {
    flex: 1,
    margin: "3%",
    padding: "1%",
    marginBottom: "0",
    paddingBottom: "0",
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
  modal: {
    backgroundColor: "white",
    marginHorizontal: "5%",
    maxHeight: "90%",
  },
  player: {
    position: "relative",
    marginHorizontal: "2%",
    marginBottom: "2%",
  },
  modalContainer: {
    // Con esto se puede ajustar para
    // que aparezca un poco más arriba
    paddingBottom: "25%",
  },
});

export default styles;
