import React, { useState, useRef, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Text from "./Text";
import Touchable from "./Touchable";
import DateTimePicker from "./DateTimePicker";
import colors from "../../constants/colors";
import * as formatter from "../../utils/formatter";
import { Ionicons } from "@expo/vector-icons";

const DateTimeInput = (props) => {
  const [date, setDate] = useState(props.initialDate);
  const datePickerRef = useRef(null);
  const onChangeDate = useCallback(
    (fieldId, selectedDate) => {
      setDate(selectedDate);
      props.onDateInput(fieldId, selectedDate);
    },
    [date, props.onDateInput]
  );

  return (
    <View style={styles.dateInputContainer}>
      <Touchable
        onPress={() => {
          datePickerRef.current.showPicker({
            fieldId: props.fieldId,
            date: date,
            minimumDate: props.minimumDate,
            maximumDate: props.maximumDate,
          });
        }}
      >
        <View style={styles.dateInputTouch}>
          <View style={styles.dateInputSection}>
            <Text type="label" style={{ marginVertical: 5 }}>
              {props.label}
              {props.label.slice(-1) === ":" ? "" : ":"}
            </Text>
            <Text style={styles.dateInput}>{formatter.formatDate(date)}</Text>
            {props.notValid && <Text type="inputValidation">{props.label} not valid</Text>}
          </View>
          <View style={styles.dateButtons}>
            <Ionicons color={colors.green} name="time-outline" size={32} />
          </View>
        </View>
      </Touchable>
      <DateTimePicker getRef={(ref) => (datePickerRef.current = ref.current)} onDateSelected={onChangeDate} />
    </View>
  );
};

const styles = StyleSheet.create({
  dateInputContainer: {
    flex: 1,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateInputTouch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateInputSection: {
    flex: 1,
  },
  dateButtons: {
    alignItems: "flex-end",
    flex: 1,
  },
  dateInput: {
    flex: 1,
    color: colors.text,
    fontFamily: "georgia",
    paddingHorizontal: 2,
    paddingVertical: 5,
  },
});

export default DateTimeInput;
