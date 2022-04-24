import { StyleSheet } from "react-native";

const containerDefault = {
  flex: 1,
  margin: "2%",
  padding: 4,
};

const styles = StyleSheet.create({
  container: {
    ...containerDefault,
  },
  containerCenter: {
    ...containerDefault,
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
});

export default styles;
