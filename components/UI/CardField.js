import React, { useState, useCallback } from "react";
import { StyleSheet, View, TextInput, Alert } from "react-native";
import Text from "./Text";
import Input from "./Input";
import Touchable from "./Touchable";
import Card from "./Card";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";

const CardField = (props) => {
  const [edit, setEdit] = useState(false);
  const [input, setInput] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [expand, setExpand] = useState(false);
  const handleEdit = () => {
    if (props.onEdit) {
      props.onEdit();
      return;
    }
    if (!edit) {
      setEdit(true);
      setInput(props.text);
      setIsValid(true);
      return;
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputIsValid) => {
      setInput(inputValue);
      setIsValid(inputIsValid);
    },
    [props, isValid, input]
  );

  const collapsible = props.collapsible && props.text && props.text.length > 200;
  return (
    <Card style={styles.card}>
      <View style={props.buttonsUp ? styles.cardButtonsUp : styles.cardView}>
        <View style={props.buttonsUp ? styles.cardContentButtonsUp : styles.cardContent}>
          {!edit ? (
            <>
              <Text style={styles.contentLabel} type="label">
                {props.label}
                {props.label.slice(-1) === ":" ? "" : ":"}
              </Text>
              <Text numberOfLines={expand ? 0 : 5}>{props.text}</Text>
            </>
          ) : (
            <Input
              id={props.id}
              autoCapitalize={!!props.autoCapitalize ? props.autoCapitalize : "none"}
              autoCorrect={!!props.autoCorrect}
              validationText={`Please enter valid ${props.label}`}
              label={props.label}
              onInputChange={inputChangeHandler}
              required={true}
              initialValue={props.text}
              initiallyValid={true}
              {...props.inputProperties}
            />
          )}
        </View>
        <View style={props.buttonsUp ? styles.cardButtonsButtonsUp : styles.cardButtons}>
          {props.editable &&
            (!edit ? (
              <Touchable onPress={handleEdit}>
                <View style={styles.cardEditButton}>
                  <FontAwesome name="pencil" size={20} color={colors.green} />
                </View>
              </Touchable>
            ) : (
              <View style={{ flexDirection: "row" }}>
                <Touchable
                  disabled={!isValid}
                  onPress={async () => {
                    try {
                      await props.onSave(props.id, input);
                      setEdit(false);
                    } catch (err) {
                      if (err) {
                        Alert.alert("Error", `${err}`, [{ text: "Ok" }]);
                      }
                    }
                  }}
                >
                  <View style={styles.cardEditButton}>
                    <FontAwesome name="save" size={20} color={isValid ? colors.green : colors.grey} />
                  </View>
                </Touchable>
                <Touchable
                  onPress={() => {
                    setEdit(false);
                    setIsValid(true);
                    setInput(props.text);
                  }}
                >
                  <View style={styles.cardEditButton}>
                    <FontAwesome name={"remove"} size={20} color={colors.green} />
                  </View>
                </Touchable>
              </View>
            ))}
          {props.onDelete && !edit && (
            <Touchable onPress={() => props.onDelete(props.id)}>
              <View style={styles.cardEditButton}>
                <FontAwesome name="trash" size={20} color={colors.error} />
              </View>
            </Touchable>
          )}
        </View>
      </View>
      {collapsible && (
        <Touchable onPress={() => setExpand(!expand)}>
          <View style={styles.expand}>
            <Ionicons name={expand ? "ios-arrow-up" : "ios-arrow-down"} color={colors.green} size={23} />
          </View>
        </Touchable>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  contentLabel: {
    paddingBottom: 3,
  },
  card: {
    marginVertical: 5,
  },
  cardView: {
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardButtonsUp: {
    marginVertical: 5,
    flexDirection: "column-reverse",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardContent: {
    flex: 3,
  },
  cardContentButtonsUp: {
    width: "100%",
  },
  cardButtons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  cardButtonsButtonsUp: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  cardEditButton: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  inputText: {
    color: colors.text,
    fontFamily: "georgia",
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.text,
  },
  expand: {
    alignItems: "center",
    // padding: 5,
  },
});

export default CardField;
