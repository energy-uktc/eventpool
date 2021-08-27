import React from "react";
import colors from "../constants/colors";
import Text from "./UI/Text";
import Card from "./UI/Card";
import Touchable from "./UI/Touchable";
import { View, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as formatter from "../utils/formatter";

const ActivityListItem = ({ activity, onSelect, onDelete }) => {
  return (
    <Card style={styles.container}>
      <Touchable onPress={() => onSelect(activity.id)}>
        <View style={styles.content}>
          <Text style={styles.title} type="header">
            {activity.title}
          </Text>
          <Text type="text" numberOfLines={3} style={styles.description}>
            {activity.description}
          </Text>
          <View style={styles.details}>
            <View style={styles.infoDetails}>
              <View style={styles.labelWithText}>
                <Text type="label">Time: </Text>
                <Text>{formatter.formatDate(activity.dateTime)}</Text>
              </View>
            </View>
            <View style={styles.buttons}>
              {activity.location && (
                <Touchable onPress={() => alert("HIII")}>
                  <View style={styles.button}>
                    <Ionicons name="location" size={24} color={colors.green} />
                  </View>
                </Touchable>
              )}
              <Touchable
                onPress={() =>
                  Alert.alert(
                    "Are you sure you want to delete this activity?",
                    "",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      { text: "OK", onPress: () => onDelete(activity.eventId, activity.id) },
                    ],
                    { cancelable: true }
                  )
                }
              >
                <View style={styles.button}>
                  <Ionicons name="trash" size={24} color={colors.error} />
                </View>
              </Touchable>
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
export default ActivityListItem;
