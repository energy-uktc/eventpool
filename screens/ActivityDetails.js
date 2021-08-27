import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from "react";
import { StyleSheet, ScrollView, View, Dimensions, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Text from "../components/UI/Text";
import Touchable from "../components/UI/Touchable";
import LoadingControl from "../components/UI/LoadingControl";
import CardField from "../components/UI/CardField";
import ErrorView from "../components/ErrorView";
import * as activityActions from "../store/actions/activity";
import * as eventActions from "../store/actions/event";
import { useDispatch, useSelector } from "react-redux";
import colors from "../constants/colors";
import * as formatter from "../utils/formatter";
import DateTimePicker from "../components/UI/DateTimePicker";
import { Ionicons } from "@expo/vector-icons";

const ActivityDetails = (props) => {
  const dispatch = useDispatch();
  const datePickerRef = useRef(null);
  const event = props.route.params.event;

  const activity = useSelector((state) => state.activity.currentActivity);
  const [loading, setLoading] = useState(true);
  const [solidLoading, setSolidLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ line1: "", line2: "" });

  const onChangeDate = (fieldId, selectedDate) => {
    updateField("dateTime", selectedDate);
  };

  const getActivityDetails = useCallback(
    async (eventId, activityId) => {
      try {
        await dispatch(activityActions.getCurrentActivity(eventId, activityId));
        if (errorMessage !== "") {
          setErrorMessage({ line1: "", line2: "" });
        }
      } catch (err) {
        setErrorMessage({ line1: "Event can not be loaded", line2: err });
      }
      setLoading(false);
      setSolidLoading(false);
    },
    [activityActions, errorMessage]
  );

  const updateField = useCallback(
    async (fieldId, value) => {
      setLoading(true);
      try {
        const activityToUpdate = Object.assign({}, activity);
        activityToUpdate[fieldId] = value;
        await dispatch(activityActions.updateActivity(activity.eventId, activityToUpdate));
        await dispatch(eventActions.getCurrentEvent(activity.eventId));

        if (errorMessage !== "") {
          setErrorMessage({ line1: "", line2: "" });
        }
      } catch (err) {
        setErrorMessage({ line1: "Event can not be updated", line2: err });
      }
      setLoading(false);
    },
    [activityActions, errorMessage, activity, loading]
  );

  const removeField = useCallback(
    async (fieldId) => {
      setLoading(true);
      try {
        const activityToUpdate = Object.assign({}, activity);
        delete activityToUpdate[fieldId];
        await dispatch(activityActions.updateActivity(activity.eventId, activityToUpdate));
        await dispatch(eventActions.getCurrentEvent(activity.eventId));
        if (errorMessage !== "") {
          setErrorMessage({ line1: "", line2: "" });
        }
      } catch (err) {
        setErrorMessage({ line1: "Event can not be updated", line2: err });
      }
      setLoading(false);
    },
    [activityActions, errorMessage, activity, loading]
  );

  useEffect(() => {
    setSolidLoading(true);
    getActivityDetails(event.id, props.route.params.activityId);
  }, []);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Touchable
          onPress={async () => {
            setLoading(true);
            await getActivityDetails(event.id, props.route.params.activityId);
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

  return (
    <View style={styles.containerView}>
      <ErrorView active={!!errorMessage} text1={errorMessage.line1} text2={errorMessage.line2} />
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient colors={[colors.white, colors.mint, colors.spearmint]} style={styles.headerView}>
          <Text type="header" style={styles.headerText}>
            {activity.title}
          </Text>
        </LinearGradient>
        <View style={styles.contentView}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text type="header" style={styles.sectionHeaderText}>
                General Information:
              </Text>
            </View>

            <CardField label="Title" id="title" text={activity.title} editable={editable} onSave={updateField} autoCapitalize="sentences" />
            <CardField
              collapsible={true}
              buttonsUp={activity.description && activity.description.length > 100}
              label="Description"
              id="description"
              text={activity.description}
              editable={editable}
              onSave={updateField}
              autoCapitalize="sentences"
              inputProperties={{ multiline: true }}
            />
            <CardField
              label="Time"
              id="dateTime"
              text={formatter.formatDate(activity.dateTime)}
              editable={editable}
              onEdit={() => {
                datePickerRef.current.showPicker({
                  fieldId: "dateTime",
                  date: new Date(activity.dateTime),
                  minimumDate: new Date(event.startDate),
                  maximumDate: event.endDate ? new Date(event.endDate) : undefined,
                });
              }}
            />
            <DateTimePicker getRef={(ref) => (datePickerRef.current = ref.current)} onDateSelected={onChangeDate} />
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
              <View style={styles.rowContainer}>
                <Ionicons name="trash" size={32} color={colors.error} />
              </View>
            </Touchable>
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
  },
  sectionHeader: {
    marginBottom: 5,
  },
  sectionHeaderText: {
    fontSize: 18,
  },
  rowContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
});

export default ActivityDetails;
