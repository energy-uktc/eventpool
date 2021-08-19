import React from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import Text from "../components/UI/Text";
import Touchable from "../components/UI/Touchable";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
const MainDrawerContent = (props) => {
  const dispatch = useDispatch();

  return (
    <DrawerContentScrollView contentContainerStyle={styles.drawerContainer} {...props}>
      <Header {...props} />
      <DrawerItemList {...props} />
      <View style={styles.logout}>
        <DrawerItem
          label="Log Out"
          inactiveTintColor={colors.white}
          labelStyle={styles.logoutText}
          inactiveBackgroundColor={colors.spearmint}
          icon={(props) => <Ionicons name="log-out" {...props} />}
          onPress={() =>
            Alert.alert(
              "Are you sure you want to log out?",
              "",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                { text: "OK", onPress: () => dispatch(authActions.logout()) },
              ],
              { cancelable: true }
            )
          }
        />
      </View>
    </DrawerContentScrollView>
  );
};

const Header = (props) => {
  return (
    <Touchable
      activeOpacity={0.7}
      onPress={() => {
        props.navigation.jumpTo("Profile");
      }}
    >
      <View style={styles.header}>
        <View>
          <Text type="label" style={styles.headerText}>
            Mario Stoilov
          </Text>
          <Text type="text" style={styles.headerText}>
            energy.uktc@gmail.com
          </Text>
        </View>

        <Ionicons name="person" size={30} color={colors.white} />
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.green,
  },
  header: {
    height: Dimensions.get("window").height / 10,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.blueish,
  },
  headerText: {
    color: colors.white,
    fontSize: 16,
  },
  logoutText: {
    fontFamily: "georgia-bold",
  },
  logout: {
    marginTop: 5,
    paddingTop: 10,
    borderTopColor: "#ccc",
    borderTopWidth: 1,
  },
});
export default MainDrawerContent;
