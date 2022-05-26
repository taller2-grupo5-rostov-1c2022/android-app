import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: "3%",
    padding: "1%",
  },
  containerNoFlex: {
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
    marginHorizontal: "3%",
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
    alignItems: "center",
    justifyContent: "center",
    padding: "4%",
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  bigLogo: {
    width: 200,
    height: 200,
    resizeMode: "stretch",
  },
  infoText: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: "2%",
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
  searchButtons: {
    borderRadius: 15,
    marginTop: "2%",
    marginHorizontal: 3,
    justifyContent: "center",
  },
  searchBar: {
    flex: 1,
    maxHeight: 50,
  },
  searchButtonText: {
    fontSize: 12,
    marginVertical: "10%",
  },
  listScreen: {
    flex: 1,
    width: "100%",
  },
});

export default styles;
