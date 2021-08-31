import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "./Text";
import colors from "../../constants/colors";
import { Picker } from "@react-native-picker/picker";

const CustomPicker = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputSection}>
        <Text type="label" style={{ marginVertical: 5 }}>
          {props.label}
          {props.label.slice(-1) === ":" ? "" : ":"}
        </Text>
        <Picker selectedValue={props.selectedValue} onValueChange={props.onValueChange}>
          {props.options.map((o) => {
            return <Picker.Item key={o.value} color={colors.text} style={styles.pickerItem} label={o.label} value={o.value} />;
          })}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputSection: {
    flex: 1,
  },
  pickerItem: {
    fontFamily: "georgia",
    fontSize: 16,
  },
});

export default CustomPicker;
