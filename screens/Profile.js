import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SafeAreaView, StyleSheet, ScrollView, View, TextInput, Modal, Dimensions, Alert } from "react-native";
import Text from "../components/UI/Text";
import Touchable from "../components/UI/Touchable";
import Card from "../components/UI/Card";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import * as userActions from "../store/actions/user";
import colors from "../constants/colors";

const Profile = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const handleUserNameSave = useCallback(async (name) => {
    await dispatch(userActions.updateName(name));
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient colors={[colors.white, colors.mint, colors.spearmint]} style={styles.headerView}>
          <Text type="header" style={styles.headerText}>
            Hello {user.name}
          </Text>
        </LinearGradient>
        <View style={styles.contentView}>
          <Text style={styles.contentHeader}>Personal Information:</Text>
          <CardField label="Name:" text={user.name} editable={true} onSave={handleUserNameSave} />
          <CardField label="E-mail:" text={user.email} />
          <CardField
            label="Password:"
            text="****************"
            editable={true}
            onEdit={() => props.navigation.navigate("ChangePassword", { email: user.email })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const CardField = (props) => {
  const [edit, setEdit] = useState(false);
  const [input, setInput] = useState("");
  const handleEdit = () => {
    if (props.onEdit) {
      props.onEdit();
      return;
    }
    if (!edit) {
      setEdit(true);
      setInput(props.text);
      return;
    }
  };

  return (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.contentLabel} type="label">
          {props.label}
        </Text>
        {!edit ? <Text>{props.text}</Text> : <TextInput style={styles.inputText} onChangeText={setInput} value={input} />}
      </View>
      {props.editable && (
        <View style={styles.cardButtons}>
          {!edit ? (
            <Touchable onPress={handleEdit}>
              <View style={styles.cardEditButton}>
                <FontAwesome name="pencil" size={20} color={colors.green} />
              </View>
            </Touchable>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <Touchable
                onPress={async () => {
                  try {
                    await props.onSave(input);
                    setEdit(false);
                  } catch (err) {
                    if (err) {
                      Alert.alert("Error", `${err}`, [{ text: "Ok" }]);
                    }
                  }
                }}
              >
                <View style={styles.cardEditButton}>
                  <FontAwesome name="save" size={20} color={colors.green} />
                </View>
              </Touchable>
              <Touchable
                onPress={() => {
                  setEdit(false);
                  setInput(props.text);
                }}
              >
                <View style={styles.cardEditButton}>
                  <FontAwesome name={"remove"} size={20} color={colors.green} />
                </View>
              </Touchable>
            </View>
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
  },
  headerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    elevation: 3,
  },
  headerText: {
    fontSize: 22,
  },
  contentView: {
    flex: 3,
    marginHorizontal: 20,
    marginTop: 10,
  },
  contentHeader: {
    fontSize: 16,
  },
  contentLabel: {
    paddingBottom: 3,
  },
  card: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardContent: {
    flex: 3,
  },
  cardButtons: {
    flex: 1,
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
});
export default Profile;
