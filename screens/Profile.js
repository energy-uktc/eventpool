import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SafeAreaView, StyleSheet, ScrollView, View, TextInput, Modal, Dimensions, Alert } from "react-native";
import Text from "../components/UI/Text";
import CardField from "../components/UI/CardField";
import { LinearGradient } from "expo-linear-gradient";
import * as userActions from "../store/actions/user";
import colors from "../constants/colors";

const Profile = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const handleUserNameSave = useCallback(async (id, name) => {
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
          <View style={styles.contentHeader}>
            <Text type="header" style={styles.contentHeaderText}>
              Personal Information:
            </Text>
          </View>
          <CardField label="Name" id="name" text={user.name} editable={true} onSave={handleUserNameSave} />
          <CardField label="E-mail" id="email" text={user.email} />
          <CardField
            label="Password"
            text="****************"
            editable={true}
            onEdit={() => props.navigation.navigate("ChangePassword", { email: user.email })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
    marginVertical: 5,
  },
  contentHeaderText: {
    fontSize: 18,
    textDecorationLine: "underline",
  },
});
export default Profile;
