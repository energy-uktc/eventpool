import React, { useEffect, useReducer, useRef } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

const SHOW_DATE_PICKER = "SHOW_PICKER";
const HANDLE_VALUE = "HANDLE_VALUE";
const HANDLE_CANCEL = "HANDLE_CANCEL";

const dateReducer = (state, action) => {
  switch (action.type) {
    case SHOW_DATE_PICKER:
      return {
        ...state,
        show: true,
        mode: "date",
        value: action.date || state.value,
        minimumDate: action.minimumDate,
        maximumDate: action.maximumDate,
        fieldId: action.fieldId,
      };
    case HANDLE_VALUE:
      if (state.mode === "date") {
        return {
          ...state,
          mode: "time",
          value: action.date || state.value,
        };
      } else {
        return {
          show: false,
          mode: "date",
          value: new Date(),
          fieldId: "",
          minimumDate: new Date(),
          maximumDate: null,
        };
      }
    case HANDLE_CANCEL:
      return {
        show: false,
        mode: "date",
        value: new Date(),
        fieldId: "",
        minimumDate: new Date(),
        maximumDate: null,
      };
    default:
      return state;
  }
};

const CustomDateTimePicker = (props) => {
  const inputRef = useRef(null);
  const [dateState, dispatchDateState] = useReducer(dateReducer, {
    show: false,
    mode: "date",
    value: new Date(),
    fieldId: "",
    minimumDate: new Date(),
    maximumDate: null,
  });

  useEffect(() => {
    if (!props.getRef) {
      return;
    }
    inputRef.current = {
      state: dateState,
      showPicker: showPicker,
    };
    props.getRef(inputRef);
  }, [dateState]);

  const showPicker = ({ date, minimumDate, maximumDate, fieldId }) => {
    let param = {
      type: SHOW_DATE_PICKER,
      date: date,
    };

    if (minimumDate) {
      param.minimumDate = minimumDate;
    }
    if (maximumDate) {
      param.maximumDate = maximumDate;
    }
    if (fieldId) {
      param.fieldId = fieldId;
    }
    dispatchDateState(param);
  };

  const onChangeDate = (e, selectedDate) => {
    if (selectedDate === undefined) {
      dispatchDateState({
        type: HANDLE_CANCEL,
      });
      return;
    }
    const newDate = selectedDate || dateState.value;
    dispatchDateState({
      type: HANDLE_VALUE,
      date: newDate,
    });
    if (dateState.mode === "time") {
      props.onDateSelected(dateState.fieldId, selectedDate);
    }
  };
  if (!dateState.show) {
    return null;
  }

  return (
    <DateTimePicker
      testID="dateTimePicker"
      value={dateState.value}
      mode={dateState.mode}
      is24Hour={true}
      display="default"
      onChange={onChangeDate}
      minimumDate={dateState.minimumDate}
      maximumDate={dateState.maximumDate}
    />
  );
};

export default CustomDateTimePicker;
