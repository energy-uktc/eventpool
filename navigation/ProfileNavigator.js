import { createNativeStackNavigator } from "react-native-screens/native-stack";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Text from "../components/UI/Text";
import ChangePassword from "../screens/auth/ChangePassword";
import colors from "../constants/colors";
import Profile from "../screens/Profile";
import Touchable from "../components/UI/Touchable";
import { Ionicons } from "@expo/vector-icons";
const Stack = createNativeStackNavigator();

const ProfileNavigator = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
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
      <Stack.Screen
        name="Profile"
        component={Profile}
        listeners={{
          focus: (e) => {
            props.navigation.setOptions({ swipeEnabled: true });
          },
          blur: (e) => {
            props.navigation.setOptions({ swipeEnabled: false });
          },
        }}
        options={{
          title: "Profile",
          headerLeft: () => (
            <View style={styles.buttonContainer}>
              <Touchable onPress={() => props.navigation.toggleDrawer()}>
                <Ionicons name="menu" size={30} color={colors.text} />
              </Touchable>
              <Text style={styles.titleText} type="header">
                Profile
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ title: "Change Password" }} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    paddingLeft: 25,
    color: colors.text,
    fontSize: 20,
  },
});
export default ProfileNavigator;
