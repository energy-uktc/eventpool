import React, { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView, RefreshControl, StyleSheet, FlatList, View } from "react-native";
import Text from "../components/UI/Text";
import Touchable from "../components/UI/Touchable";
import LoadingControl from "../components/UI/LoadingControl";
import FloatingPlusButton from "../components/UI/FloatingPlusButton";
import EventListItem from "../components/EventListItem";
import * as eventActions from "../store/actions/event";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import ErrorView from "../components/ErrorView";

const EventsOverview = (props) => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.event.events);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const handleSelectEvent = useCallback(
    (eventId) => {
      props.navigation.navigate("EventDetails", { eventId: eventId });
    },
    [props.navigation]
  );

  const getEvents = useCallback(
    async (onlyActive) => {
      try {
        if (onlyActive) {
          await dispatch(eventActions.getActiveEvents());
        } else {
          await dispatch(eventActions.getEvents());
        }
        if (errorMessage !== "") {
          setErrorMessage("");
        }
      } catch (err) {
        setErrorMessage(err);
      }
      setLoading(false);
    },
    [eventActions, errorMessage]
  );

  useEffect(() => {
    getEvents(false);
  }, []);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Touchable
          onPress={async () => {
            setIsRefreshing(true);
            await getEvents(true);
            setIsRefreshing(false);
          }}
        >
          <View>
            <Ionicons color={colors.text} size={28} name="refresh" />
          </View>
        </Touchable>
      ),
    });
  }, []);

  const eventsArr = Object.values(events).sort((a, b) => {
    const aDate = Date.parse(a.startDate);
    const bDate = Date.parse(b.startDate);
    if (aDate === bDate) {
      return 0;
    }
    if (aDate > bDate) {
      return -1;
    }
    return 1;
  });
  return (
    <SafeAreaView style={styles.container}>
      <LoadingControl active={loading} />
      <ErrorView active={!!errorMessage} text1="We can't load the events right now." text2={errorMessage} />
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={async () => {
              setIsRefreshing(true);
              await getEvents(true);
              setIsRefreshing(false);
            }}
            title="Pull to refresh"
            tintColor={colors.green}
            titleColor={colors.blueish}
            colors={[colors.green]} //{Color.primary}
          />
        }
        style={styles.list}
        data={eventsArr}
        renderItem={({ item }) => <EventListItem event={item} onSelect={handleSelectEvent} />}
        keyExtractor={(item) => item.id}
      />
      <FloatingPlusButton
        onPress={() => {
          console.log("ADD");
        }}
        iconName="ios-add"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    marginTop: 10,
  },
  errorMessageView: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: colors.error,
  },
});
export default EventsOverview;