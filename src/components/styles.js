import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: "3%",
    padding: "1%",
  },
  chatBubble: {
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "70%",
  },
  chatInput: {
    flex: 1,
  },
  triangle: {
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderRightColor: "transparent",
  },
  mirror: {
    transform: [{ scaleX: -1 }],
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
    flex: 1,
  },
  spacedActivityIndicator: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginVertical: "8%",
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
    flex: 1,
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
  progressLabel: {
    marginHorizontal: 10,
    textAlign: "center",
    height: "100%",
  },
  progress: {
    height: 5,
  },
  playerProgress: {
    position: "relative",
    marginHorizontal: "2%",
    height: 20,
  },
  player: {
    position: "relative",
    marginHorizontal: "2%",
    marginBottom: "2%",
    paddingLeft: "3%",
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
  notificationBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  favoritesTitle: {
    fontWeight: "600",
    fontSize: 20,
  },
});

export default styles;
