import React from "react";
import Text from "./UI/Text";
import { View, StyleSheet } from "react-native";
import colors from "../constants/colors";

const ErrorView = (props) => {
  let viewStyle = { ...styles.errorMessageView, ...props.style };
  if (!props.active) {
    viewStyle = styles.hidden;
  }
  return (
    <View style={viewStyle}>
      {!!props.text1 && <Text style={styles.errorMessage}>{props.text1}</Text>}
      {!!props.text2 && <Text style={styles.errorMessage}>{props.text2}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  errorMessageView: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: colors.error,
  },
  hidden: {
    width: 0,
    height: 0,
  },
});

export default ErrorView;
