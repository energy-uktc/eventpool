import React, { useState, useCallback, useReducer, useEffect } from "react";
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
import { useDispatch } from "react-redux";
import * as authActions from "../../store/actions/auth";
import LoadingControl from "../../components/UI/LoadingControl";
import colors from "../../constants/colors";
import { FORM_UPDATE, formReducer } from '../../service/formReducer'

const SignIn = props => {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("Init")
    return () => {
      console.log("Remove")
    }
  }, [])
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
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
      await dispatch(
        authActions.login({
          email: formState.inputValues.email,
          password: formState.inputValues.password
        })
      );
    } catch (err) {
      setIsLoading(false);
      Alert.alert(`Error login`, `${err}`, [
        { text: "OK" }
      ]);
    }
  }, [dispatch, formState]);
  let passwordInput = null;

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
              id="email"
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
              onSubmitEditing={() => { }}
              secure={true}
              allowView={true}
              autoCapitalize="none"
              autoCorrect={false}
              validationText="Please enter valid password"
              label="Password"
              onInputChange={inputChangeHandler}
              required={true}
              minLength={5}
            />
            <View style={styles.buttonContainer}>
              <Button
                disabled={!formState.formIsValid}
                title="Login"
                color={colors.blueish}
                onPress={authHandler}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Switch to Sign Up"
                color={colors.green}
                onPress={() => {
                  props.navigation.replace('SignUp')
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

// AuthScreen.navigationOptions = {
//   headerTitle: "Sign In"
// };

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
    maxHeight: 400
  },
  buttonContainer: {
    marginTop: 10
  }
});

export default SignIn;
