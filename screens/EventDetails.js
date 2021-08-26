import React, { useState, useEffect, useCallback, useReducer } from "react";
import { StyleSheet, ScrollView, View, Dimensions, Button } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Text from "../components/UI/Text";
import Touchable from "../components/UI/Touchable";
import LoadingControl from "../components/UI/LoadingControl";
import CardField from "../components/UI/CardField";
import ErrorView from "../components/ErrorView";
import * as eventActions from "../store/actions/event";
import { useDispatch, useSelector } from "react-redux";
import colors from "../constants/colors";
import * as formatter from "../utils/formatter";
import DateTimePicker from "@react-native-community/datetimepicker";

const SHOW_DATE_PICKER = "SHOW_PICKER";
const HANDLE_VALUE = "HANDLE_VALUE";
const HANDLE_CANCEL = "HANDLE_CANCEL";

const dateReducer = (state, action) => {
  switch (action.type) {
    case SHOW_DATE_PICKER:
      return {
        ...state,
        show: true,
        mode: "date",
        value: action.date || state.value,
        minimumDate: action.minimumDate,
        maximumDate: action.maximumDate,
        fieldId: action.fieldId,
      };
    case HANDLE_VALUE:
      if (state.mode === "date") {
        return {
          ...state,
          mode: "time",
          value: action.date || state.value,
        };
      } else {
        return {
          show: false,
          mode: "date",
          value: new Date(),
          fieldId: "",
          minimumDate: new Date(),
          maximumDate: null,
        };
      }
    case HANDLE_CANCEL:
      return {
        show: false,
        mode: "date",
        value: new Date(),
        fieldId: "",
        minimumDate: new Date(),
        maximumDate: null,
      };
    default:
      return state;
  }
};

const EventDetails = (props) => {
  const dispatch = useDispatch();

  const event = useSelector((state) => state.event.currentEvent);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState({ line1: "", line2: "" });
  const [dateState, dispatchDateState] = useReducer(dateReducer, {
    show: false,
    mode: "date",
    value: new Date(),
    fieldId: "",
    minimumDate: new Date(),
    maximumDate: null,
  });
  const onChangeDate = (e, selectedDate) => {
    if (selectedDate === undefined) {
      dispatchDateState({
        type: HANDLE_CANCEL,
      });
      return;
    }
    const newDate = selectedDate || dateState.value;
    dispatchDateState({
      type: HANDLE_VALUE,
      date: newDate,
    });
    if (dateState.mode === "time") {
      if (dateState.fieldId === "endDate") {
        if (newDate.getTime() < Date.parse(event.startDate)) {
          setErrorMessage({ line1: "Error updating the event", line2: "Event ending time can not be before the starting time." });
          return;
        }
      } else {
        if (event.endDate && newDate.getTime() > Date.parse(event.endDate)) {
          setErrorMessage({ line1: "Event can not be updated", line2: "Event ending time can not be before the starting time." });
          return;
        }
      }
      updateEventField(dateState.fieldId, selectedDate || dateState.value);
    }
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
    getEventDetails(props.route.params.eventId);
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
                dispatchDateState({
                  type: SHOW_DATE_PICKER,
                  date: new Date(event.startDate),
                  minimumDate: new Date(),
                  maximumDate: event.endDate ? new Date(event.endDate) : undefined,
                  fieldId: "startDate",
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
                  dispatchDateState({
                    type: SHOW_DATE_PICKER,
                    date: new Date(event.endDate),
                    minimumDate: new Date(event.startDate),
                    fieldId: "endDate",
                  });
                }}
              />
            ) : (
              <View style={styles.rowContainer}>
                <View style={styles.addEndDateButton}>
                  <Button
                    title="Add End Time"
                    onPress={() => {
                      dispatchDateState({
                        type: SHOW_DATE_PICKER,
                        date: new Date(event.startDate),
                        minimumDate: new Date(event.startDate),
                        fieldId: "endDate",
                      });
                    }}
                    color={colors.green}
                  />
                </View>
              </View>
            )}
            {dateState.show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={dateState.value}
                mode={dateState.mode}
                is24Hour={true}
                display="default"
                onChange={onChangeDate}
                minimumDate={dateState.minimumDate}
                maximumDate={dateState.maximumDate}
              />
            )}
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text type="header" style={styles.sectionHeaderText}>
                Attendees:
              </Text>
            </View>
          </View>
          {event.numberOfActivities > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text type="header" style={styles.sectionHeaderText}>
                  Activities:
                </Text>
              </View>
            </View>
          )}
          {event.numberOfPolls > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text type="header" style={styles.sectionHeaderText}>
                  Polls:
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <LoadingControl active={loading} />
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
    marginVertical: 5,
    // justifyContent: "center",
    // alignItems: "center",
  },
  sectionHeader: {
    marginBottom: 5,
  },
  sectionHeaderText: {
    fontSize: 18,
    textDecorationLine: "underline",
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
