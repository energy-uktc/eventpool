import React, { useState, useReducer, useCallback } from "react";
import { Modal, StyleSheet, Dimensions, View, Button, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Card from "../components/UI/Card";
import Text from "../components/UI/Text";
import Input from "../components/UI/Input";
import Touchable from "../components/UI/Touchable";
import { FORM_UPDATE, formReducer } from "../service/formReducer";
import DateTimeInput from "../components/UI/DateTimeInput";
import colors from "../constants/colors";
import * as formatter from "../utils/formatter";
import { Ionicons } from "@expo/vector-icons";
import event from "../store/reducers/event";

const initState = () => {
  const initialStartDate = new Date();
  initialStartDate.setMilliseconds(0);
  initialStartDate.setSeconds(0);
  initialStartDate.setMinutes(0);
  initialStartDate.setDate(initialStartDate.getDate() + 1);

  return {
    inputValues: {
      title: "",
      description: "",
      startDate: initialStartDate,
      endDate: null,
    },
    inputValidities: {
      title: false,
      description: false,
      startDate: true,
      endDate: true,
    },
    formIsValid: false,
  };
};

const CreateEvent = (props) => {
  const [withEndDate, setWithEndDate] = useState(false);
  const [formState, dispatchFormState] = useReducer(formReducer, {}, initState);

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
      let isStartDateValid = formState.inputValidities.startDate;
      let isEndDateValid = formState.inputValidities.endDate;

      let startDate = formState.inputValues.startDate;
      let endDate = formState.inputValues.endDate;
      if (fieldId === "endDate") {
        endDate = date;
        isEndDateValid = endDate.getTime() >= formState.inputValues.startDate.getTime();
        isStartDateValid = true;
      } else {
        startDate = date;
        isStartDateValid = !formState.inputValues.endDate || startDate.getTime() <= formState.inputValues.endDate.getTime();
        isEndDateValid = true;
      }
      inputChangeHandler("startDate", startDate, isStartDateValid);
      inputChangeHandler("endDate", endDate, isEndDateValid);
    },
    [formState.inputValues.endDate, formState.inputValues.startDate]
  );

  let descriptionInput = null;

  return (
    <Modal animationType="slide" transparent={true} visible={props.show}>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={0}>
          <Card style={styles.card}>
            <View style={styles.contentView}>
              <ScrollView contentContainerStyle={styles.inputContainer}>
                <Input
                  id="title"
                  onSubmitEditing={() => {
                    descriptionInput.focus();
                  }}
                  autoCorrect={false}
                  validationText="Enter event title"
                  label="Title"
                  onInputChange={inputChangeHandler}
                  required={true}
                  minLength={3}
                />
                <Input
                  id="description"
                  multiline={true}
                  childRef={(ref) => {
                    descriptionInput = ref;
                  }}
                  autoCorrect={false}
                  validationText="Please enter event description"
                  label="Description"
                  onInputChange={inputChangeHandler}
                  required={true}
                />
                <DateTimeInput
                  fieldId="startDate"
                  label="Start Time"
                  initialDate={formState.inputValues.startDate}
                  onDateInput={handleDateInput}
                  minimumDate={new Date()}
                  maximumDate={formState.inputValues.endDate}
                  notValid={!formState.inputValidities.startDate}
                />
                {withEndDate ? (
                  <>
                    <View style={styles.endDateButtonContainer}>
                      <Touchable
                        onPress={() => {
                          dispatchFormState({
                            type: FORM_UPDATE,
                            value: null,
                            isValid: true,
                            input: "endDate",
                          });
                          setWithEndDate(false);
                        }}
                      >
                        <View>
                          <Text style={styles.endDateButtonText}>- Remove End Date</Text>
                        </View>
                      </Touchable>
                    </View>
                    <DateTimeInput
                      fieldId="endDate"
                      label="End Time"
                      initialDate={formState.inputValues.startDate}
                      onDateInput={handleDateInput}
                      minimumDate={formState.inputValues.startDate}
                      notValid={!formState.inputValidities.endDate}
                    />
                  </>
                ) : (
                  <View style={styles.endDateButtonContainer}>
                    <Touchable
                      onPress={() => {
                        handleDateInput("endDate", formState.inputValues.startDate);
                        setWithEndDate(true);
                      }}
                    >
                      <View>
                        <Text style={styles.endDateButtonText}>+ Add End Date</Text>
                      </View>
                    </Touchable>
                  </View>
                )}
              </ScrollView>
              <View style={styles.buttonsContainer}>
                <View style={styles.rowButton}>
                  <Button title="Cancel" onPress={props.onCancel} color={colors.green} />
                </View>
                <View style={styles.rowButton}>
                  <Button
                    title="Save"
                    disabled={!formState.formIsValid}
                    onPress={() =>
                      props.onSave({
                        title: formState.inputValues.title,
                        description: formState.inputValues.description,
                        startDate: formState.inputValues.startDate,
                        endDate: formState.inputValues.endDate,
                      })
                    }
                    color={colors.blueish}
                  />
                </View>
              </View>
            </View>
          </Card>
        </KeyboardAvoidingView>
      </View>
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
    maxHeight: (Dimensions.get("screen").height / 3) * 2,
    height: 430,
    padding: 0,
  },
  gradient: {
    flex: 1,
  },
  contentView: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    // alignItems: "center",
  },
  statusText: {
    textAlign: "center",
    fontSize: 20,
  },
  inputContainer: {
    // flexGrow: 1,
  },
  buttonsContainer: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  rowButton: {
    width: Dimensions.get("screen").width / 3,
  },
  endDateButtonContainer: {
    alignItems: "center",
    paddingVertical: 5,
  },
  endDateButtonText: {
    textDecorationLine: "underline",
    color: colors.blueish,
  },
});
export default CreateEvent;
