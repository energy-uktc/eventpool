import React, { useReducer, useCallback } from "react";
import { Modal, StyleSheet, Dimensions, View, Button, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import { FORM_UPDATE, formReducer } from "../service/formReducer";
import DateTimeInput from "../components/UI/DateTimeInput";
import colors from "../constants/colors";

const CreateActivity = (props) => {
  const event = props.event;
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: "",
      description: "",
      dateTime: new Date(event.startDate),
    },
    inputValidities: {
      title: false,
      description: false,
      dateTime: true,
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
      const isValid = date.getTime() >= Date.parse(event.startDate) && (!event.endDate || date.getTime() <= Date.parse(event.endDate));
      console.log(date >= event.startDate);
      console.log(date <= event.endDate);
      console.log(isValid);

      console.log(isValid);
      inputChangeHandler(fieldId, date, isValid);
    },
    [formState.inputValues.dateTime]
  );

  let descriptionInput = null;

  return (
    <Modal animationType="slide" transparent={true} visible={props.show}>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={0}>
          <Card style={styles.card}>
            <View style={styles.contentView}>
              <ScrollView>
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
                  fieldId="dateTime"
                  label="Time"
                  initialDate={formState.inputValues.dateTime}
                  onDateInput={handleDateInput}
                  minimumDate={new Date(event.startDate)}
                  maximumDate={event.endDate ? new Date(event.endDate) : null}
                  notValid={!formState.inputValidities.dateTime}
                />
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
                        dateTime: formState.inputValues.dateTime,
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
export default CreateActivity;
