import React from "react";
import { useDispatch } from "react-redux";
import { SafeAreaView, StatusBar, StyleSheet, FlatList, Button } from "react-native";
import EventItem from "../components/EventItem";

import EVENTS from "../data/events";

const Home = (props) => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.list}
        data={EVENTS}
        renderItem={({ item }) => <EventItem title={item.title} startDate={item.startDate} createdBy={item.createdBy} />}
        keyExtractor={(item) => item.id}
      />
      <Button
        title="Change Password"
        onPress={() => {
          props.navigation.navigate("ChangePassword");
        }}
      />
      <Button
        title="Toggle"
        onPress={() => {
          props.navigation.toggleDrawer();
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    marginTop: StatusBar.currentHeight || 0,
  },
  list: {},
});
export default Home;
