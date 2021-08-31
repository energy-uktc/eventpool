import React, { useEffect, useState, useCallback } from "react";
import { enableScreens } from "react-native-screens";
import { View, Modal } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import SplashScreen from "../screens/SplashScreen";
import ConnectionState from "../components/ConnectionState";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { getUser } from "../store/actions/user";
import * as Linking from "expo-linking";
import MainDrawerNavigator from "./MainDrawerNavigator";
import AuthStackNavigator from "./AuthStackNavigator";

import NetInfo from "@react-native-community/netinfo";

enableScreens();
const Stack = createNativeStackNavigator();

const NavContainer = (props) => {
  const dispatch = useDispatch();

  const [connected, setConnected] = useState(true);
  const [connectionStateText, setConnectionStateText] = useState("");

  const { authenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const getUserInfo = async () => {
      if (authenticated) {
        await dispatch(getUser());
      }
    };
    getUserInfo();
  }, [authenticated]);

  const closeConnectionDialog = useCallback(() => {
    setConnected(true);
    setConnectionStateText("");
  }, []);

  const handleNoConnectionWithServer = useCallback(async (status) => {
    let stateMessage = "";
    switch (status) {
      case 502:
        stateMessage = "502 Bad Gateway";
        break;
      case 503:
        stateMessage = "503 Service Unavailable";
        break;
      case 504:
        stateMessage = "504 Gateway Time-out";
        break;
      case "Network Error":
        const state = await NetInfo.fetch();
        if (state.isConnected) {
          stateMessage = "Can not connect to the server";
        } else {
          stateMessage = "No Internet Connection";
        }
        break;
      default:
        return;
    }
    setConnected(false);
    setConnectionStateText(stateMessage);
  }, []);

  const config = {
    screens: {
      Authentication: {
        screens: {
          VerifyAccount: "verifyAccount",
          ResetPassword: "resetPassword",
        },
      },
      MainNavigation: {
        screens: {
          EventsNavigator: {
            initialRouteName: "Events",
            screens: {
              EventDetails: "eventDetails",
            },
          },
        },
      },
    },
  };

  const linking = {
    prefixes: [Linking.createURL("/")],
    config,
  };

  if (loading) {
    return <SplashScreen onNoConnection={handleNoConnectionWithServer} />;
  }

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={!connected}>
        <ConnectionState stateMessage={connectionStateText} onClose={closeConnectionDialog} />
      </Modal>
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
    </>
  );
};

export default NavContainer;
