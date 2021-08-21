import React, { useReducer, useEffect, useState, useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Text from "./Text";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";
const RESET = "RESET";
const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
        touched: true,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    case RESET:
      return {
        value: action.value,
        isValid: action.isValid,
        touched: false,
      };
    default:
      return state;
  }
};
const isValidURL = (str) => {
  if (!str) {
    return true;
  }
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
};

const Input = (props) => {
  const { onInputChange } = props;
  const inputRef = useRef(null);

  const [state, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : "",
    isValid: !!props.initiallyValid,
    touched: false,
  });
  const [secure, setSecure] = useState(props.secure);

  useEffect(() => {
    if (!props.getRef) {
      return;
    }
    inputRef.current = {
      state: state,
      resetInput: resetInput,
    };
    props.getRef(inputRef);
  }, [state]);

  useEffect(() => {
    if (!props.initialValue) {
      return;
    }
    if (props.initialValue === state.value) {
      return;
    }
    resetInput();
  }, [props.initialValue]);

  useEffect(() => {
    if (state.touched) {
      props.onInputChange(props.id, state.value, state.isValid);
    }
  }, [state, onInputChange]);

  const lostFocusHandler = () => {
    dispatch({
      type: INPUT_BLUR,
    });
  };

  const resetInput = () => {
    dispatch({
      type: RESET,
      value: props.initialValue ? props.initialValue : "",
      isValid: !!props.initiallyValid,
    });
  };
  const textChangeHandler = (text) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.url && !isValidURL(text)) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && (+text > props.max || !+text)) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    if (props.equal != null && text !== props.equal) {
      isValid = false;
    }
    if (!props.required && text.trim().length === 0) {
      isValid = true;
    }
    dispatch({
      type: INPUT_CHANGE,
      value: text,
      isValid: isValid,
    });
  };

  return (
    <View style={styles.inputControl}>
      <View
        style={{
          flexDirection: props.positionHorizontal ? "row" : "column",
          alignItems: props.positionHorizontal ? "center" : "stretch",
        }}
      >
        <Text
          type="label"
          style={{
            marginVertical: props.positionHorizontal ? 0 : 5,
            marginRight: props.positionHorizontal ? 8 : 0,
          }}
        >
          {props.label}
        </Text>
        <View style={styles.inputSection}>
          <TextInput
            {...props}
            secureTextEntry={secure}
            style={styles.input}
            value={state.value}
            onChangeText={textChangeHandler}
            onBlur={lostFocusHandler}
            ref={props.childRef}
          />
          {props.secure && props.allowView && (
            <Ionicons style={styles.inputIcon} name={secure ? "eye" : "eye-off"} size={20} color={colors.green} onPress={() => setSecure(!secure)} />
          )}
        </View>
      </View>
      {!state.isValid && state.touched && <Text type="inputValidation">{props.validationText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputControl: {
    width: "100%",
  },
  input: {
    flex: 1,
    color: colors.text,
    fontFamily: "georgia",
    paddingHorizontal: 2,
    paddingVertical: 5,
  },
  inputSection: {
    overflow: "hidden",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  inputIcon: {
    padding: 10,
    backgroundColor: colors.white,
  },
});

export default Input;
