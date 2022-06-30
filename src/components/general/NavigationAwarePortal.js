import React, { useRef, useEffect } from "react";
import { Animated } from "react-native";
import { Portal } from "react-native-paper";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";

const NavigationAwarePortal = ({ children }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    const removeFocusListener = navigation.addListener("focus", _show);
    const removeBlurListener = navigation.addListener("blur", _hide);

    if (navigation.isFocused()) {
      _show();
    }

    return () => {
      removeFocusListener();
      removeBlurListener();
    };
  }, []);

  const _show = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const _hide = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Portal>
      <Animated.View
        pointerEvents="box-none"
        style={{ opacity: opacity, flex: 1 }}
      >
        {children}
      </Animated.View>
    </Portal>
  );
};

NavigationAwarePortal.propTypes = {
  children: PropTypes.node,
};

export default NavigationAwarePortal;
