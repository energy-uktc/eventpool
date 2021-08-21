import React, { useState, useCallback, useReducer } from "react";
import { useDispatch } from "react-redux";
import { ScrollView, View, KeyboardAvoidingView, StyleSheet, Button, Alert, Platform, Dimensions } from "react-native";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Text from "../../components/UI/Text";
import * as authService from "../../service/authService";
import LoadingControl from "../../components/UI/LoadingControl";
import colors from "../../constants/colors";
import { FORM_UPDATE, formReducer } from "../../service/formReducer";
import { LinearGradient } from "expo-linear-gradient";

const ResetPassword = (props) => {
  const dispatch = useDispatch();
  const verificationCode = props.route.params.verificationCode;

  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    inputValidities: {
      newPassword: false,
      confirmNewPassword: false,
    },
    formIsValid: false,
  });

  const inputHandler = useCallback(
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
      await authService.resetPassword(verificationCode, formState.inputValues.newPassword);
      setDone(true);
    } catch (err) {
      setErrorMessage(err);
    }
    setIsLoading(false);
  }, [dispatch, formState]);

  return (
    <LinearGradient style={styles.screen} colors={[colors.white, colors.mint, colors.spearmint]}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={50}>
        <View style={styles.textContentView}>
          {done ? (
            <>
              <Text style={styles.text} type="header">
                Your password has been reset successfully.
              </Text>
              <Text />
              <Text style={styles.text} type="header">
                Please log in.
              </Text>
            </>
          ) : errorMessage === "" ? (
            <Text style={styles.text} type="header">
              Enter your new password
            </Text>
          ) : (
            <>
              <Text style={styles.text} type="header">
                Some problem ocurred during password reset.
              </Text>
              <Text />
              <Text style={styles.text} type="label">
                {errorMessage}
              </Text>
            </>
          )}
        </View>
        {!done ? (
          <Card style={styles.authContainer}>
            <ScrollView>
              <Input
                id="newPassword"
                secure={true}
                allowView={false}
                autoCapitalize="none"
                autoCorrect={false}
                validationText="Please enter valid password"
                label="New password"
                onInputChange={inputHandler}
                required={true}
                minLength={8}
              />
              <Input
                id="confirmNewPassword"
                secure={true}
                allowView={true}
                autoCapitalize="none"
                autoCorrect={false}
                validationText="Confirm your password"
                label="Confirm password"
                onInputChange={inputHandler}
                required={true}
                minLength={8}
                equal={formState.inputValues.newPassword}
              />

              <View style={styles.buttonContainer}>
                <Button disabled={!formState.formIsValid} title="Reset" color={colors.blueish} onPress={changePasswordHandler} />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  title="Log In"
                  color={colors.green}
                  onPress={() => {
                    if (!props.navigation.canGoBack()) {
                      props.navigation.replace("SignIn");
                    } else {
                      props.navigation.popToTop();
                    }
                  }}
                />
              </View>
            </ScrollView>
            <LoadingControl active={isLoading} />
          </Card>
        ) : (
          <View style={styles.doneButton}>
            <Button
              title="Log In"
              color={colors.green}
              onPress={() => {
                if (!props.navigation.canGoBack()) {
                  props.navigation.replace("SignIn");
                } else {
                  props.navigation.popToTop();
                }
              }}
            />
          </View>
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
  textContentView: {
    paddingHorizontal: 10,
    paddingVertical: 30,
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
  },
  buttonContainer: {
    marginTop: 10,
    width: "100%",
  },
  doneButton: {
    marginTop: 10,
    width: Dimensions.get("screen").width / 3,
  },
});

export default ResetPassword;
