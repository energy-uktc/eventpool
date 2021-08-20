import React, { useCallback, useState, useEffect } from "react";
import { View, Button, StyleSheet, Dimensions, Alert } from "react-native";
import * as authService from "../../service/authService";
import { LinearGradient } from "expo-linear-gradient";
import Text from "../../components/UI/Text";
import colors from "../../constants/colors";
import LoadingControl from "../../components/UI/LoadingControl";
import * as Linking from "expo-linking";

const VerifyAccount = (props) => {
  const { email, password } = props.route.params;
  const verified = props.route.params.verified === "true";
  const verifying = !(props.route.params.verified === undefined);

  const [isLoading, setIsLoading] = useState(false);

  const resendVerificationEmail = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.resendVerificationEmail(
        {
          email: email,
          password: password,
        },
        `${Linking.createURL("/")}verifyAccount`
      );
    } catch (err) {
      if (err) {
        Alert.alert(`Error ocurred while sending the activation link`, `${err}`, [{ text: "OK" }]);
      }
    }
    setIsLoading(false);
  }, [email, password]);

  return (
    <LinearGradient style={styles.screen} colors={[colors.mint, colors.white, colors.white]}>
      <View>
        {verifying ? (
          verified ? (
            <>
              <Text style={styles.text}>Your account was successfully verified!</Text>
              <Text></Text>
              <Text style={styles.text}>Log in and have a great time organizing your events with friends!</Text>
            </>
          ) : (
            <>{props.route.params.errorMessage && <Text style={styles.text}>{props.route.params.errorMessage}</Text>}</>
          )
        ) : (
          <>
            <Text style={styles.text}>You are successfully registered, but your account is not yet verified.</Text>
            <Text></Text>
            <Text style={styles.text}>
              An email has been sent to your email address containing an activation link. Please click on the link to activate your account.
            </Text>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {!verifying && (
          <View style={styles.button}>
            <Button title="Resend Email" color={colors.green} onPress={resendVerificationEmail} />
          </View>
        )}
        <View style={styles.button}>
          <Button
            title="Log In"
            color={colors.blueish}
            onPress={() => {
              props.navigation.replace("SignIn");
            }}
          />
        </View>
      </View>

      <LoadingControl active={isLoading} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 10,
  },
  text: {
    textAlign: "center",
    fontSize: 20,
  },
  buttonContainer: {
    width: "100%",
    paddingVertical: 10,
    justifyContent: "space-around",
    alignItems: "flex-start",
    flexDirection: "row",
  },
  button: {
    width: Dimensions.get("window").width / 3,
  },
});
export default VerifyAccount;
