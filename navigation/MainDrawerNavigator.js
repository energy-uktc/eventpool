import React from "react";
import { Dimensions } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import EventsNavigator from "./EventNavigator";
import ProfileNavigator from "./ProfileNavigator";
import colors from "../constants/colors";
import MainDrawerContent from "./MainDrawerContent";
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

const MainDrawerNavigator = (props) => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <MainDrawerContent {...props} />}
      screenOptions={{
        drawerInactiveTintColor: colors.white,
        drawerActiveTintColor: colors.blueish,
        drawerActiveBackgroundColor: colors.white,
        drawerInactiveBackgroundColor: colors.blueish,
        drawerItemStyle: {
          padding: 0,
          margin: 0,
        },
        drawerStyle: {
          backgroundColor: colors.mint,
          width: (Dimensions.get("window").width / 3) * 2,
        },
        headerStyle: {
          backgroundColor: colors.spearmint,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: "georgia-bold",
        },
        drawerLabelStyle: {
          fontFamily: "georgia-bold",
        },
      }}
    >
      <Drawer.Screen
        name="EventsNavigator"
        component={EventsNavigator}
        options={{ drawerIcon: (props) => <Ionicons name="calendar" {...props} />, title: "Events", headerShown: false, swipeEnabled: false }}
      />
      <Drawer.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{ drawerIcon: (props) => <Ionicons name="person" {...props} />, title: "Profile", headerShown: false, swipeEnabled: false }}
      />
      {/* <Drawer.Screen name="Settings" component={Events} options={{ drawerIcon: (props) => <Ionicons name="settings" {...props} /> }} /> */}
    </Drawer.Navigator>
  );
};

export default MainDrawerNavigator;
