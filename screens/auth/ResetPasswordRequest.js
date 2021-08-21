import React, { useState, useCallback, useReducer } from "react";
import { ScrollView, View, KeyboardAvoidingView, StyleSheet, Button, Alert, Platform } from "react-native";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Text from "../../components/UI/Text";
import * as authService from "../../service/authService";
import LoadingControl from "../../components/UI/LoadingControl";
import colors from "../../constants/colors";
import { FORM_UPDATE, formReducer } from "../../service/formReducer";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";

const ResetPassword = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
    },
    inputValidities: {
      email: false,
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

  const sendResetPasswordEmail = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Validation Error", "Please enter valid authentication information!", [{ text: "OK" }]);
      return;
    }
    try {
      await authService.sendResetPasswordEmail(formState.inputValues.email, Linking.createURL("/resetPassword"));
      setEmailSent(true);
    } catch (err) {}
    setIsLoading(false);
  }, [formState]);

  return (
    <LinearGradient style={styles.screen} colors={[colors.white, colors.mint, colors.spearmint]}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={50}>
        <View style={styles.textContentView}>
          {!emailSent ? (
            <>
              <Text style={styles.text} type="header">
                We will send you an email with a password reset link.
              </Text>
              <Text />
              <Text style={styles.text} type="header">
                Please enter your email.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.text} type="header">
                Verification link was successfully sent to your email.
              </Text>
              <Text style={styles.text} type="header">
                Follow the link on your mobile device in order to reset your password.
              </Text>
              <Text />
              <Text style={styles.text} type="header">
                If you have not received the mail please wait a couple of minutes and check your Spam or Junk folder or try resending
              </Text>
            </>
          )}
        </View>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              autoCapitalize="none"
              autoCorrect={false}
              validationText="Please enter valid email"
              label="E-Mail"
              onInputChange={inputHandler}
              required={true}
              email
            />

            <View style={styles.buttonContainer}>
              <Button
                disabled={!formState.formIsValid}
                title={emailSent ? "Resend" : "Send"}
                color={colors.blueish}
                onPress={sendResetPasswordEmail}
              />
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
  },
});

export default ResetPassword;
