import { createNativeStackNavigator } from "react-native-screens/native-stack";
import React from "react";
import { Button } from "react-native";
import SignIn from "../screens/auth/SignIn";
import SignUp from "../screens/auth/SignUp";
import ResetPassword from "../screens/auth/ResetPassword";
import ResetPasswordRequest from "../screens/auth/ResetPasswordRequest";
import VerifyAccount from "../screens/auth/VerifyAccount";
import colors from "../constants/colors";

const Stack = createNativeStackNavigator();

const AuthNavigator = (props) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.spearmint,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: "georgia-bold",
        },
      }}
    >
      <Stack.Screen name="SignIn" component={SignIn} options={{ title: "Sign In" }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ title: "Sign Up" }} />
      <Stack.Screen name="VerifyAccount" component={VerifyAccount} options={{ title: "Verify Account" }} />
      <Stack.Screen name="ResetPasswordRequest" component={ResetPasswordRequest} options={{ title: "Reset Password" }} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ title: "Reset Password" }} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
