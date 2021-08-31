import React, { useReducer, useCallback, useState } from "react";
import { Modal, StyleSheet, Dimensions, View, Button, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import Card from "./UI/Card";
import Touchable from "./UI/Touchable";
import Input from "./UI/Input";
import Picker from "./UI/Picker";
import LoadingControl from "./UI/LoadingControl";
import ErrorView from "./ErrorView";
import { Ionicons } from "@expo/vector-icons";
import { FORM_UPDATE, REMOVE_KEY, formReducer } from "../service/formReducer";
import DateTimeInput from "./UI/DateTimeInput";
import * as pollService from "../service/pollService";
import colors from "../constants/colors";

const CreatePoll = (props) => {
  const event = props.event;
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ line1: "", line2: "" });
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      question: "",
      type: "SINGLE_OPTION",
      endTime: new Date(event.startDate),
      option1: "",
      option2: "",
    },
    inputValidities: {
      question: false,
      type: true,
      endTime: true,
      option1: false,
      option2: false,
    },
    formIsValid: false,
  });

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputIsValid) => {
      dispatchFormState({
        type: FORM_UPDATE,
        value: inputValue,
        isValid: inputIsValid,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );
  const handleDateInput = useCallback(
    (fieldId, date) => {
      const isValid = date.getTime() <= Date.parse(event.startDate) || (event.endDate && date.getTime() <= Date.parse(event.endDate));
      inputChangeHandler(fieldId, date, isValid);
    },
    [formState.inputValues.dateTime]
  );

  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      let pollToCreate = {
        type: formState.inputValues.type,
        endTime: formState.inputValues.endTime,
        question: formState.inputValues.question,
      };

      const options = Object.keys(formState.inputValues)
        .filter((o) => o.startsWith("option"))
        .map((o) => {
          return {
            text: formState.inputValues[o],
            showOrder: parseInt(o.split("option")[1]),
          };
        });

      pollToCreate.options = options;

      await pollService.createPoll(event.id, pollToCreate);
      setErrorMessage({ line1: "", line2: "" });
      setLoading(false);
      props.onSave();
    } catch (err) {
      setLoading(false);
      setErrorMessage({ line1: "Poll can not be created", line2: err });
    }
  }, [formState, event, pollService]);

  const options = Object.keys(formState.inputValues)
    .filter((o) => o.startsWith("option"))
    .map((o) => {
      return {
        id: o,
        index: parseInt(o.split("option")[1]),
      };
    })
    .sort((a, b) => {
      if (a.index === b.index) {
        return 0;
      }
      if (a.index > b.index) {
        return 1;
      }
      return -1;
    });

  return (
    <Modal animationType="slide" transparent={true} visible={props.show}>
      <Card style={styles.card}>
        <View style={styles.contentView}>
          <ErrorView active={!!errorMessage} text1={errorMessage.line1} text2={errorMessage.line2} />
          <ScrollView>
            <Picker
              label="Type"
              selectedValue={formState.inputValues.type}
              onValueChange={(itemValue, itemIndex) => inputChangeHandler("type", itemValue, true)}
              options={[
                { label: "Single Vote", value: "SINGLE_OPTION" },
                { label: "Multiple Votes", value: "MULTIPLE_OPTIONS" },
              ]}
            />
            <DateTimeInput
              fieldId="endTime"
              label="End Time"
              initialDate={formState.inputValues.endTime}
              onDateInput={handleDateInput}
              minimumDate={new Date()}
              maximumDate={event.endDate ? new Date(event.endDate) : new Date(event.startDate)}
              notValid={!formState.inputValidities.endTime}
            />
            <Input
              id="question"
              autoCorrect={false}
              multiline={true}
              validationText="Enter your question"
              label="Question"
              onInputChange={inputChangeHandler}
              required={true}
              minLength={5}
            />
            {options.map((o) => {
              return (
                <Input
                  key={o.id}
                  id={o.id}
                  autoCorrect={false}
                  multiline={true}
                  validationText="Enter voting option"
                  label={`Option ${o.index}`}
                  onInputChange={inputChangeHandler}
                  required={true}
                />
              );
            })}
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 10 }}>
              <Touchable
                onPress={() => {
                  const lastOption = options[options.length - 1];
                  dispatchFormState({
                    type: REMOVE_KEY,
                    key: lastOption.id,
                  });
                }}
                disabled={options.length <= 2}
              >
                <View style={{ marginHorizontal: 10 }}>
                  <Ionicons name="remove-circle-outline" color={options.length > 2 ? colors.green : colors.grey} size={35} />
                </View>
              </Touchable>
              <Touchable
                onPress={() => {
                  const lastOption = options[options.length - 1];
                  inputChangeHandler(`option${lastOption.index + 1}`, "", false);
                }}
                disabled={!formState.formIsValid}
              >
                <View style={{ marginHorizontal: 10 }}>
                  <Ionicons name="add-circle-outline" color={formState.formIsValid ? colors.green : colors.grey} size={35} />
                </View>
              </Touchable>
            </View>
          </ScrollView>
          <View style={styles.buttonsContainer}>
            <View style={styles.rowButton}>
              <Button title="Cancel" onPress={props.onCancel} color={colors.green} />
            </View>
            <View style={styles.rowButton}>
              <Button title="Save" disabled={!formState.formIsValid} onPress={async () => await handleSave()} color={colors.blueish} />
            </View>
          </View>
        </View>
        <LoadingControl active={loading} />
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.transparent,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flex: 1,
    height: 320,
    padding: 0,
  },
  gradient: {
    flex: 1,
  },
  contentView: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  statusText: {
    textAlign: "center",
    fontSize: 20,
  },
  buttonsContainer: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  rowButton: {
    width: Dimensions.get("screen").width / 3,
  },
});
export default CreatePoll;
