import React, { useState } from "react";
import colors from "../constants/colors";
import { useSelector } from "react-redux";
import Text from "./UI/Text";
import Card from "./UI/Card";
import Touchable from "./UI/Touchable";
import ErrorView from "./ErrorView";
import LoadingControl from "./UI/LoadingControl";
import { View, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as formatter from "../utils/formatter";
import * as pollService from "../service/pollService";

const PollListItem = ({ poll, onAfterDelete, onAfterVote, editable }) => {
  const user = useSelector((state) => state.user);
  const event = useSelector((state) => state.event.currentEvent);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ line1: "", line2: "" });
  const [expand, setExpand] = useState(false);

  const isOpenForVoting = Date.now() < Date.parse(poll.endTime) && editable;

  const options = poll.options.sort((a, b) => {
    const orderA = parseInt(a.showOrder);
    const orderB = parseInt(b.showOrder);
    return orderA - orderB;
  });

  const handleVote = async (optionId) => {
    try {
      setLoading(true);
      const currentOption = poll.options.find((o) => o.id === optionId);
      if (currentOption.votes.some((v) => v.email === user.email)) {
        await pollService.removeVote(event.id, poll.id, optionId);
      } else {
        if (poll.type === "SINGLE_OPTION") {
          const userVoteOptions = poll.options.filter((o) => o.votes.some((v) => v.email === user.email));
          for (const userVoteOption of userVoteOptions) {
            await pollService.removeVote(event.id, poll.id, userVoteOption.id);
          }
        }
        await pollService.vote(event.id, poll.id, optionId);
      }
      setErrorMessage({ line1: "", line2: "" });
      await onAfterVote();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setErrorMessage({ line1: "Vote was not send successfully. Please try again", line2: err });
    }
  };

  return (
    <Card style={styles.container}>
      <ErrorView active={!!errorMessage} text1={errorMessage.line1} text2={errorMessage.line2} />

      <View style={styles.content}>
        <Touchable onPress={() => setExpand(!expand)}>
          <View>
            <Text style={styles.title} type="header">
              {poll.question}
            </Text>
            <Text type="text" style={styles.description}>
              Created by {poll.createdBy.userName}
            </Text>
            <View style={styles.details}>
              <View style={styles.infoDetails}>
                <View style={styles.labelWithText}>
                  <Text type="label">End Time: </Text>
                  <Text>{formatter.formatDate(poll.endTime)}</Text>
                </View>
                <View style={styles.labelWithText}>
                  <Text type="label">Status: </Text>
                  <Text style={{ color: isOpenForVoting ? colors.green : colors.error }}>
                    {isOpenForVoting ? "Open for voting" : "Closed for voting"}
                  </Text>
                </View>
              </View>
              <View style={styles.buttons}>
                {poll.createdBy.email === user.email && (
                  <Touchable
                    onPress={() =>
                      Alert.alert(
                        "Are you sure you want to delete this poll?",
                        "",
                        [
                          {
                            text: "Cancel",
                            style: "cancel",
                          },
                          {
                            text: "OK",
                            onPress: async () => {
                              await pollService.deletePoll(event.id, poll.id);
                              await onAfterDelete();
                            },
                          },
                        ],
                        { cancelable: true }
                      )
                    }
                  >
                    <View style={styles.button}>
                      <Ionicons name="trash" size={24} color={colors.error} />
                    </View>
                  </Touchable>
                )}
              </View>
            </View>
            <View style={{ alignItems: "center", marginTop: 5 }}>
              <Ionicons name={expand ? "ios-arrow-up" : "ios-arrow-down"} color={colors.green} size={23} />
            </View>
          </View>
        </Touchable>
        {expand && (
          <View style={styles.optionsContainer}>
            {options.map((o) => {
              const isVoted = o.votes.some((v) => v.email === user.email);
              return (
                <View key={o.id} style={styles.singleOptionContainer}>
                  <Touchable disabled={!isOpenForVoting} onPress={async () => await handleVote(o.id)}>
                    <View style={{ ...styles.singleOptionButton, backgroundColor: isVoted ? colors.grey : colors.white }}>
                      <Text>
                        <Text style={{ fontFamily: "georgia-bold" }}>{o.showOrder}.</Text> {o.text}
                      </Text>
                    </View>
                  </Touchable>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {o.votes.length > 0 && (
                      <View style={styles.votesCount}>
                        <Text style={{ color: colors.white, fontSize: 12 }}>{o.votes.length}</Text>
                      </View>
                    )}
                    {o.votes &&
                      o.votes.map((vote) => {
                        return (
                          <View key={vote.email} style={styles.userBadge}>
                            <Text style={{ color: colors.white, fontSize: 12 }}>{vote.userName}</Text>
                          </View>
                        );
                      })}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
      <LoadingControl active={loading} />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  optionsContainer: {
    flex: 1,
    borderTopColor: colors.grey,
    borderTopWidth: 1,
    marginTop: 10,
    paddingTop: 10,
  },
  singleOptionContainer: {
    flex: 1,
    marginVertical: 10,
  },
  singleOptionButton: {
    flex: 1,
    padding: 10,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 10,
  },
  votesCount: {
    width: 25,
    height: 25,
    margin: 3,
    padding: 0,
    backgroundColor: colors.error,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  userBadge: {
    backgroundColor: colors.blueish,
    flex: 0,
    margin: 5,
    padding: 5,
    borderRadius: 10,
  },
});
export default PollListItem;
