import React from "react";
import { Text, StyleSheet } from "react-native";
import colors from "../../constants/colors";

const CustomText = (props) => {
  const style = props.type ? (styles[props.type] ? styles[props.type] : styles.text) : styles.text;
  return (
    <Text {...props} style={{ ...style, ...props.style }}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  header: {
    //marginVertical: 5,
    color: colors.green,
    fontFamily: "georgia-bold",
    fontSize: 18,
  },
  label: {
    //marginVertical: 5,
    color: colors.green,
    fontFamily: "georgia-bold",
    fontSize: 15,
  },
  inputValidation: {
    fontFamily: "georgia-italic",
    fontSize: 10,
    color: colors.error,
  },
  text: {
    color: colors.text,
    fontFamily: "georgia",
    fontSize: 16,
  },
});

export default CustomText;
