import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Wrapper de una View adentro de un SafeAreaView.
// Se usa para facilitar el tener el contenido dentro del área visible y
// poder usar estilos de una View como padding, que no esta soportado por el
// SafeAreaView (https://reactnative.dev/docs/safeareaview)
class ExternalView extends React.Component {
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View {...this.props}></View>
      </SafeAreaView>
    );
  }
}

export default ExternalView;
