import React, { useState, useReducer, useCallback, useRef } from "react";
import { Modal, StyleSheet, Dimensions, View, Button, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import Card from "./UI/Card";
import Text from "./UI/Text";
import Input from "./UI/Input";
import Touchable from "./UI/Touchable";
import LoadingControl from "./UI/LoadingControl";
import ErrorView from "./ErrorView";
import { FORM_UPDATE, formReducer } from "../service/formReducer";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as eventService from "../service/eventService";
import * as Linking from "expo-linking";

const ShareEvent = (props) => {
  const emailInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ line1: "", line2: "" });
  const [emailsArr, setEmailsArr] = useState([]);
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
    },
    inputValidities: {
      email: false,
    },
    formIsValid: false,
  });

  const sendInvitations = useCallback(async () => {
    try {
      setLoading(true);
      await eventService.sendInvitations(props.eventId, emailsArr, Linking.createURL("/eventDetails"));
      setErrorMessage({ line1: "", line2: "" });
      setLoading(false);
      props.onSend();
    } catch (err) {
      setLoading(false);
      setErrorMessage({ line1: "Event invitations can not be send", line2: err });
    }
  }, [emailsArr, props.eventId]);

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

  const addInvitee = (email) => {
    const idx = emailsArr.indexOf(email);
    emailInputRef.current.resetInput();
    inputChangeHandler(email, "", true);
    if (idx === -1) {
      const newArr = Object.assign([], emailsArr);
      newArr.push(email);
      setEmailsArr(newArr);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={props.show}>
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.card} behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={0}>
          <Card style={styles.card}>
            <View style={styles.contentView}>
              <ErrorView active={!!errorMessage} text1={errorMessage.line1} text2={errorMessage.line2} />
              <ScrollView>
                <Input
                  id="email"
                  getRef={(ref) => (emailInputRef.current = ref.current)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  validationText="Enter valid email"
                  label="Email"
                  onInputChange={inputChangeHandler}
                  required={true}
                  email
                />
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginVertical: 10 }}>
                  <Touchable
                    onPress={() => {
                      addInvitee(formState.inputValues.email);
                    }}
                    disabled={!formState.inputValidities.email}
                  >
                    <View>
                      <Ionicons name="add-circle-outline" color={formState.inputValidities.email ? colors.green : colors.grey} size={35} />
                    </View>
                  </Touchable>
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {emailsArr &&
                    emailsArr.map((email) => {
                      return (
                        <View key={email} style={{ backgroundColor: colors.blueish, flex: 0, margin: 5, padding: 5, borderRadius: 10 }}>
                          <Text style={{ color: colors.white }}>{email}</Text>
                        </View>
                      );
                    })}
                </View>
              </ScrollView>
              <View style={styles.buttonsContainer}>
                <View style={styles.rowButton}>
                  <Button title="Cancel" onPress={props.onCancel} color={colors.green} />
                </View>
                <View style={styles.rowButton}>
                  <Button
                    title="Send"
                    disabled={!formState.formIsValid || emailsArr.length < 1}
                    onPress={async () => await sendInvitations()}
                    color={colors.blueish}
                  />
                </View>
              </View>
            </View>
          </Card>
        </KeyboardAvoidingView>
        <LoadingControl active={loading} />
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
    width: "100%",
    maxHeight: (Dimensions.get("screen").height / 3) * 2,
    height: 400,
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
export default ShareEvent;
