import React from "react";
import { Platform, TouchableNativeFeedback, TouchableOpacity } from "react-native";

const Touchable = (props) => {
  const TouchableComponent = Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity;
  return <TouchableComponent {...props}>{props.children}</TouchableComponent>;
};

export default Touchable;
