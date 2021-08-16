import React, { useState, useCallback, useReducer } from 'react'
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Alert,
  Platform
} from "react-native";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import { LinearGradient } from "expo-linear-gradient";
import * as authService from '../../service/authService'
import LoadingControl from "../../components/UI/LoadingControl";
import colors from "../../constants/colors";
import { FORM_UPDATE, formReducer } from '../../service/formReducer'

const SignUp = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    inputValidities: {
      name: false,
      email: false,
      password: false,
    },
    formIsValid: false
  });

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputIsValid) => {
      dispatchFormState({
        type: FORM_UPDATE,
        value: inputValue,
        isValid: inputIsValid,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  const authHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert(
        "Validation Error",
        "Please enter valid authentication information!",
        [{ text: "OK" }]
      );
      return;
    }
    try {
      setIsLoading(true);
      await authService.register({
        name: formState.inputValues.name,
        email: formState.inputValues.email,
        password: formState.inputValues.password
      });
      props.navigation.replace('VerifyAccount', { email: formState.inputValues.email, password: formState.inputValues.password })
    } catch (err) {
      setIsLoading(false);
      Alert.alert(`Error ocurred during registration`, `${err}`, [
        { text: "OK" }
      ]);
    }
  }, [formState]);

  let emailInput = null;
  let passwordInput = null;
  let confirmPasswordInput = null;

  return (
    <LinearGradient
      style={styles.screen}
      colors={[colors.white, colors.mint, colors.spearmint]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={50}
      >
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="name"
              onSubmitEditing={() => {
                emailInput.focus();
              }}
              autoCapitalize="none"
              autoCorrect={false}
              validationText="Please enter your name"
              label="Name"
              onInputChange={inputChangeHandler}
              required={true}
              minLength={3}
            />
            <Input
              id="email"
              childRef={ref => {
                emailInput = ref
              }}
              onSubmitEditing={() => {
                passwordInput.focus();
              }}
              autoCapitalize="none"
              autoCorrect={false}
              validationText="Please enter valid email"
              label="E-Mail"
              onInputChange={inputChangeHandler}
              required={true}
              email
            />
            <Input
              id="password"
              childRef={ref => {
                passwordInput = ref;
              }}
              onSubmitEditing={() => {
                confirmPasswordInput.focus();
              }}
              onSubmitEditing={() => { }}
              secure={true}
              autoCapitalize="none"
              autoCorrect={false}
              validationText="Please enter valid password"
              label="Password"
              onInputChange={inputChangeHandler}
              required={true}
              minLength={5}
            />
            <Input
              id="confirmPassword"
              childRef={ref => {
                confirmPasswordInput = ref;
              }}
              onSubmitEditing={() => { }}
              secure={true}
              allowView={true}
              autoCapitalize="none"
              autoCorrect={false}
              validationText="Confirm your password"
              label="Confirm Password"
              onInputChange={inputChangeHandler}
              required={true}
              equal={formState.inputValues.password}
              minLength={5}
            />
            <View style={styles.buttonContainer}>
              <Button
                title="Register"
                disabled={!formState.formIsValid}
                color={colors.blueish}
                onPress={authHandler}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Switch to Log In"
                color={colors.green}
                onPress={() => {
                  props.navigation.replace('SignIn')
                }}
              />
            </View>
          </ScrollView>
          <LoadingControl active={isLoading} />
        </Card>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.mint
  },
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 450
  },
  buttonContainer: {
    marginTop: 10
  }
});

export default SignUp;