import { createNativeStackNavigator } from "react-native-screens/native-stack";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Text from "../components/UI/Text";
import colors from "../constants/colors";
import EventsOverview from "../screens/EventsOverview";
import EventDetails from "../screens/EventDetails";
import Touchable from "../components/UI/Touchable";
import { Ionicons } from "@expo/vector-icons";
const Stack = createNativeStackNavigator();

const EventNavigator = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="Events"
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
        name="Events"
        component={EventsOverview}
        listeners={{
          focus: (e) => {
            props.navigation.setOptions({ swipeEnabled: true });
          },
          blur: (e) => {
            props.navigation.setOptions({ swipeEnabled: false });
          },
        }}
        options={{
          title: "Events",
          headerLeft: () => (
            <View style={styles.buttonContainer}>
              <Touchable onPress={() => props.navigation.toggleDrawer()}>
                <Ionicons name="menu" size={30} color={colors.text} />
              </Touchable>
              <Text style={styles.titleText} type="header">
                Events
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen name="EventDetails" component={EventDetails} options={{ title: "Event Details" }} />
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
export default EventNavigator;
