import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import Color from "../../constants/colors";

const LoadingControl = props => {
  return (
    <View style={{ ...styles.centered, ...props.style, backgroundColor: props.active ? "#F5FCFF88" : undefined }} pointerEvents={props.active ? 'auto' : 'none'}>
      <ActivityIndicator size="large" color={Color.blueish} animating={props.active} />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  }
});

export default LoadingControl;
