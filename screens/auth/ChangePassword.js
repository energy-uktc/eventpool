import React, { useState, useCallback, useReducer } from "react";
import { useDispatch } from "react-redux";
import { ScrollView, View, KeyboardAvoidingView, StyleSheet, Button, Alert, Platform } from "react-native";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Text from "../../components/UI/Text";
import * as authService from "../../service/authService";
import LoadingControl from "../../components/UI/LoadingControl";
import colors from "../../constants/colors";
import { FORM_UPDATE, formReducer } from "../../service/formReducer";
import { LinearGradient } from "expo-linear-gradient";

const ChangePassword = (props) => {
  const dispatch = useDispatch();
  const email = props.route.params.email;
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    inputValidities: {
      password: false,
      newPassword: false,
      confirmNewPassword: false,
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

  const changePasswordHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Validation Error", "Please enter valid authentication information!", [{ text: "OK" }]);
      return;
    }
    try {
      setIsLoading(true);
      await authService.changePassword(email, formState.inputValues.password, formState.inputValues.newPassword);
      setDone(true);
    } catch (err) {
      setIsLoading(false);
      if (err) {
        setErrorMessage(err);
      }
    }
  }, [dispatch, formState]);

  let newPasswordInput = null;
  let confirmNewPasswordInput = null;

  return (
    <LinearGradient style={styles.screen} colors={[colors.white, colors.mint, colors.spearmint]}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={50}>
        <View style={styles.textContentView}>
          {done ? (
            <>
              <Text style={styles.text} type="header">
                Your password has been changed successfully.
              </Text>
            </>
          ) : (
            errorMessage !== "" && (
              <>
                <Text style={styles.text} type="header">
                  Some problem ocurred during password change.
                </Text>
                <Text />
                <Text style={styles.text} type="label">
                  {errorMessage}
                </Text>
              </>
            )
          )}
        </View>
        {!done && (
          <Card style={styles.authContainer}>
            <ScrollView>
              <Input
                id="password"
                onSubmitEditing={() => {
                  newPasswordInput.focus();
                }}
                secure={true}
                allowView={true}
                autoCapitalize="none"
                autoCorrect={false}
                validationText="Please enter valid password"
                label="Password"
                onInputChange={inputChangeHandler}
                required={true}
                minLength={8}
              />

              <Input
                id="newPassword"
                childRef={(ref) => {
                  newPasswordInput = ref;
                }}
                onSubmitEditing={() => {
                  confirmNewPasswordInput.focus();
                }}
                secure={true}
                allowView={false}
                autoCapitalize="none"
                autoCorrect={false}
                validationText="Please enter valid password"
                label="New password"
                onInputChange={inputChangeHandler}
                required={true}
                minLength={8}
              />
              <Input
                id="confirmNewPassword"
                childRef={(ref) => {
                  confirmNewPasswordInput = ref;
                }}
                onSubmitEditing={() => {}}
                secure={true}
                allowView={true}
                autoCapitalize="none"
                autoCorrect={false}
                validationText="Confirm your password"
                label="Confirm password"
                onInputChange={inputChangeHandler}
                required={true}
                equal={formState.inputValues.newPassword}
                minLength={8}
              />
              <View style={styles.buttonContainer}>
                <Button disabled={!formState.formIsValid} title="Submit" color={colors.blueish} onPress={changePasswordHandler} />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  title="Cancel"
                  color={colors.green}
                  onPress={() => {
                    props.navigation.goBack();
                  }}
                />
              </View>
            </ScrollView>
            <LoadingControl active={isLoading} />
          </Card>
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.mint,
  },
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  textContentView: {
    paddingHorizontal: 10,
    paddingVertical: 30,
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default ChangePassword;
