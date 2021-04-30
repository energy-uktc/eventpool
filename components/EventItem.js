import React from "react";
import colors from '../constants/colors'
import { View, Text, StyleSheet } from "react-native";
import USERS from '../data/users';

const EventItem = (props) => {

  const userName = USERS.find(u => u.id === props.createdBy).userName.slice(0, 10).toUpperCase();
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Text numberOfLines={1}>{userName}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.text}>{props.title}</Text>
        <Text style={styles.text}>{props.startDate.toLocaleDateString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: colors.borderColor,
    padding: 5,
  },
  icon: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    width: 60,
    borderWidth: 1,
    borderRadius: 30,
    aspectRatio: 1,
    backgroundColor: "#ccc",
    //borderRadius
    borderColor: colors.borderColor,
    // backgroundColor: 
  },
  details: {
    // flex: 5,
    justifyContent: "flex-start",
    paddingLeft: 5
  },
  text: {
    fontFamily: 'georgia'
  }
});
export default EventItem;
