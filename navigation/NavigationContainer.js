import React, { useEffect } from "react";
import { enableScreens } from "react-native-screens";
import { useSelector, useDispatch } from "react-redux";
import SplashScreen from "../screens/SplashScreen";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import colors from "../constants/colors";
import { getUser } from "../store/actions/user";
import * as Linking from "expo-linking";
import MainDrawerNavigator from "./MainDrawerNavigator";
import AuthStackNavigator from "./AuthStackNavigator";

enableScreens();
const Stack = createNativeStackNavigator();

const NavContainer = (props) => {
  const dispatch = useDispatch();

  const { authenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const getUserInfo = async () => {
      if (authenticated) {
        await dispatch(getUser());
      }
    };
    getUserInfo();
  }, [authenticated]);

  const config = {
    screens: {
      VerifyAccount: "verifyAccount",
    },
  };

  const linking = {
    prefixes: [Linking.createURL("/")],
    config,
  };

  if (loading) {
    return <SplashScreen />;
  }
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {authenticated ? (
          <Stack.Screen name="MainNavigation" component={MainDrawerNavigator} />
        ) : (
          <Stack.Screen name="Authentication" component={AuthStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavContainer;
