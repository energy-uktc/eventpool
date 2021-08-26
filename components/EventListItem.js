import React from "react";
import colors from "../constants/colors";
import Text from "./UI/Text";
import Card from "./UI/Card";
import Touchable from "./UI/Touchable";
import { View, StyleSheet } from "react-native";
import USERS from "../data/users";
import { Ionicons } from "@expo/vector-icons";
import * as formatter from "../utils/formatter";

const EventListItem = ({ event, onSelect }) => {
  return (
    <Card style={styles.container}>
      <Touchable onPress={() => onSelect(event.id)}>
        <View style={styles.content}>
          <Text style={styles.title} type="header">
            {event.title}
          </Text>
          <Text type="text" numberOfLines={3} style={styles.description}>
            {event.description}
          </Text>
          <View style={styles.details}>
            <View style={styles.infoDetails}>
              <View style={styles.labelWithText}>
                <Text type="label">Start Time: </Text>
                <Text>{formatter.formatDate(event.startDate)}</Text>
              </View>
              {event.endDate && (
                <View style={styles.labelWithText}>
                  <Text type="label">End Time: </Text>
                  <Text>{formatter.formatDate(event.endDate)}</Text>
                </View>
              )}
              <View style={styles.labelWithText}>
                <Text type="label">Attendees: </Text>
                <Text>{formatter.formatAttendeesText(event.numberOfAttendees)}</Text>
              </View>

              {event.numberOfActivities > 0 && (
                <View style={styles.labelWithText}>
                  <Text type="label">Activities: </Text>
                  <Text>{formatter.formatActivitiesText(event.numberOfActivities)}</Text>
                </View>
              )}
            </View>
            <View style={styles.buttons}>
              {event.location && (
                <Touchable onPress={() => alert("HIII")}>
                  <View style={styles.button}>
                    <Ionicons name="location" size={24} color={colors.green} />
                  </View>
                </Touchable>
              )}
            </View>
          </View>
        </View>
      </Touchable>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  labelWithText: {
    flexDirection: "row",
    marginTop: 5,
  },
  description: {
    marginBottom: 10,
  },
  title: {
    marginBottom: 5,
    textDecorationLine: "underline",
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    paddingLeft: 5,
  },
  details: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoDetails: {
    flex: 4,
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    padding: 5,
  },
});
export default EventListItem;
