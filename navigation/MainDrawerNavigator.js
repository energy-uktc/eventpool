import React from "react";
import { Dimensions } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "../screens/Home";
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
      <Drawer.Screen name="Home" component={Home} options={{ drawerIcon: (props) => <Ionicons name="home" {...props} /> }} />
      <Drawer.Screen name="Profile" component={Home} options={{ drawerIcon: (props) => <Ionicons name="person" {...props} /> }} />
      <Drawer.Screen name="Settings" component={Home} options={{ drawerIcon: (props) => <Ionicons name="settings" {...props} /> }} />
    </Drawer.Navigator>
  );
};
export default MainDrawerNavigator;
