import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { StyleSheet, ScrollView, View, Dimensions, Button } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Text from "../components/UI/Text";
import Touchable from "../components/UI/Touchable";
import LoadingControl from "../components/UI/LoadingControl";
import CardField from "../components/UI/CardField";
import ErrorView from "../components/ErrorView";
import * as eventActions from "../store/actions/event";
import * as activityService from "../service/activityService";
import { clearCurrentActivity } from "../store/actions/activity";
import { useDispatch, useSelector } from "react-redux";
import colors from "../constants/colors";
import * as formatter from "../utils/formatter";
import DateTimePicker from "../components/UI/DateTimePicker";
import { Ionicons } from "@expo/vector-icons";
import ActivityListItem from "../components/ActivityListItem";

const EventDetails = (props) => {
  const dispatch = useDispatch();
  const datePickerRef = useRef(null);

  const event = useSelector((state) => state.event.currentEvent);
  const [loading, setLoading] = useState(true);
  const [solidLoading, setSolidLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ line1: "", line2: "" });

  const onChangeDate = (fieldId, selectedDate) => {
    if (fieldId === "endDate") {
      if (selectedDate.getTime() < Date.parse(event.startDate)) {
        setErrorMessage({ line1: "Error updating the event", line2: "Event ending time can not be before the starting time." });
        return;
      }
    } else {
      if (event.endDate && selectedDate.getTime() > Date.parse(event.endDate)) {
        setErrorMessage({ line1: "Event can not be updated", line2: "Event ending time can not be before the starting time." });
        return;
      }
    }
    updateEventField(fieldId, selectedDate);
  };

  const getEventDetails = useCallback(
    async (eventId) => {
      try {
        await dispatch(eventActions.getCurrentEvent(eventId));
        if (errorMessage !== "") {
          setErrorMessage({ line1: "", line2: "" });
        }
      } catch (err) {
        setErrorMessage({ line1: "Event can not be loaded", line2: err });
      }
      setLoading(false);
      setSolidLoading(false);
    },
    [eventActions, errorMessage]
  );

  const deleteActivity = useCallback(
    async (eventId, activityId) => {
      try {
        await activityService.deleteActivity(eventId, activityId);
        await dispatch(eventActions.getCurrentEvent(eventId));
        if (errorMessage !== "") {
          setErrorMessage({ line1: "", line2: "" });
        }
      } catch (err) {
        setErrorMessage({ line1: "Event can not be loaded", line2: err });
      }
      setLoading(false);
      setSolidLoading(false);
    },
    [eventActions, errorMessage]
  );

  const updateEventField = useCallback(
    async (fieldId, value) => {
      setLoading(true);
      try {
        const eventToUpdate = Object.assign({}, event);
        eventToUpdate[fieldId] = value;
        await dispatch(eventActions.updateEvent(eventToUpdate));
        if (errorMessage !== "") {
          setErrorMessage({ line1: "", line2: "" });
        }
      } catch (err) {
        setErrorMessage({ line1: "Event can not be updated", line2: err });
      }
      setLoading(false);
    },
    [eventActions, errorMessage, event, loading]
  );

  const removeEventField = useCallback(
    async (fieldId) => {
      setLoading(true);
      try {
        const eventToUpdate = Object.assign({}, event);
        delete eventToUpdate[fieldId];
        await dispatch(eventActions.updateEvent(eventToUpdate));
        if (errorMessage !== "") {
          setErrorMessage({ line1: "", line2: "" });
        }
      } catch (err) {
        setErrorMessage({ line1: "Event can not be updated", line2: err });
      }
      setLoading(false);
    },
    [eventActions, errorMessage, event, loading]
  );

  useEffect(() => {
    setSolidLoading(true);
    getEventDetails(props.route.params.eventId);
  }, []);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Touchable
          onPress={async () => {
            setLoading(true);
            await getEventDetails(props.route.params.eventId);
          }}
        >
          <View>
            <Ionicons color={colors.text} size={28} name="refresh" />
          </View>
        </Touchable>
      ),
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (errorMessage) {
        setErrorMessage({ line1: "", line2: "" });
      }
    }, 1000 * 20);
    return () => {
      clearInterval(interval);
    };
  }, [errorMessage]);

  const editable = !!event && (Date.parse(event.startDate) > Date.now() || (!!event.endDate && Date.parse(event.endDate) > Date.now()));
  let activities = [];
  if (event.activities) {
    activities = event.activities.sort((a, b) => {
      const aDate = Date.parse(a.dateTime);
      const bDate = Date.parse(b.dateTime);
      if (aDate === bDate) {
        return 0;
      }
      if (aDate > bDate) {
        return 1;
      }
      return -1;
    });
  }

  return (
    <View style={styles.containerView}>
      <ErrorView active={!!errorMessage} text1={errorMessage.line1} text2={errorMessage.line2} />
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient colors={[colors.white, colors.mint, colors.spearmint]} style={styles.headerView}>
          <Text type="header" style={styles.headerText}>
            {event.title}
          </Text>
        </LinearGradient>
        <View style={styles.contentView}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text type="header" style={styles.sectionHeaderText}>
                General Information:
              </Text>
            </View>

            <CardField label="Title" id="title" text={event.title} editable={editable} onSave={updateEventField} autoCapitalize="sentences" />
            <CardField
              collapsible={true}
              buttonsUp={event.description && event.description.length > 100}
              label="Description"
              id="description"
              text={event.description}
              editable={editable}
              onSave={updateEventField}
              autoCapitalize="sentences"
              inputProperties={{ multiline: true }}
            />
            <CardField
              label="Start Time"
              id="startDate"
              text={formatter.formatDate(event.startDate)}
              editable={editable}
              onEdit={() => {
                datePickerRef.current.showPicker({
                  fieldId: "startDate",
                  date: new Date(event.startDate),
                  minimumDate: new Date(),
                  maximumDate: event.endDate ? new Date(event.endDate) : undefined,
                });
              }}
            />
            {event.endDate ? (
              <CardField
                label="End Time"
                id="endDate"
                text={formatter.formatDate(event.endDate)}
                onDelete={editable ? removeEventField : null}
                editable={editable}
                onEdit={() => {
                  datePickerRef.current.showPicker({
                    fieldId: "endDate",
                    date: new Date(event.endDate),
                    minimumDate: new Date(event.startDate),
                  });
                }}
              />
            ) : (
              <View style={styles.rowContainer}>
                <View style={styles.addEndDateButton}>
                  <Button
                    disabled={!editable}
                    title="Add End Time"
                    onPress={() => {
                      datePickerRef.current.showPicker({
                        fieldId: "endDate",
                        date: new Date(event.startDate),
                        minimumDate: new Date(event.startDate),
                      });
                    }}
                    color={colors.green}
                  />
                </View>
              </View>
            )}
            <DateTimePicker getRef={(ref) => (datePickerRef.current = ref.current)} onDateSelected={onChangeDate} />
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text type="header" style={styles.sectionHeaderText}>
                Attendees:
              </Text>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {event.attendees &&
                event.attendees.map((a) => {
                  return (
                    <View key={a.email} style={{ backgroundColor: colors.blueish, flex: 0, margin: 5, padding: 5, borderRadius: 10 }}>
                      <Text style={{ color: colors.white }}>{a.userName}</Text>
                    </View>
                  );
                })}
            </View>
            <CardField label="Created By" text={event && event.createdBy && event.createdBy.userName ? event.createdBy.userName : ""} />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text type="header" style={styles.sectionHeaderText}>
                Activities:
              </Text>
            </View>
            {activities.length > 0 ? (
              activities.map((a) => {
                return (
                  <ActivityListItem
                    key={a.id}
                    activity={a}
                    onSelect={() => {
                      dispatch(clearCurrentActivity());
                      props.navigation.navigate("ActivityDetails", { event: event, activityId: a.id });
                    }}
                    onDelete={(eventId, activityId) => {
                      deleteActivity(eventId, activityId);
                    }}
                  />
                );
              })
            ) : (
              <Text>There is no activities in this event. If your event includes more that one activity you can manage them from here.</Text>
            )}
            <View style={styles.rowContainer}>
              <View style={styles.addEndDateButton}>
                <Button
                  disabled={!editable}
                  title="Add Activity"
                  onPress={() => {
                    alert("Add Activity");
                  }}
                  color={colors.green}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text type="header" style={styles.sectionHeaderText}>
                Polls:
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <LoadingControl active={loading} solid={solidLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
  },
  headerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  headerText: {
    paddingVertical: Dimensions.get("window").height / 10,
    fontSize: 22,
    textAlign: "center",
  },
  contentView: {
    flex: 3,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  section: {
    flex: 1,
    marginTop: 5,
    paddingBottom: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    // justifyContent: "center",
    // alignItems: "center",
  },
  sectionHeader: {
    marginBottom: 5,
  },
  sectionHeaderText: {
    fontSize: 18,
    // textDecorationLine: "underline",
  },
  rowContainer: {
    alignItems: "center",
  },
  addEndDateButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    width: Dimensions.get("screen").width / 3,
  },
});

export default EventDetails;
