import React from "react";
import { View, StyleSheet, Dimensions, Button } from "react-native";
import Text from "../components/UI/Text";
import Card from "../components/UI/Card";
import colors from "../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const ConnectionState = (props) => {
  return (
    <Card style={styles.card}>
      <LinearGradient style={styles.container} colors={[colors.white, colors.white, colors.white]}>
        <MaterialIcons name="wifi-off" size={Dimensions.get("screen").width / 3} color={colors.green} />
        <View style={styles.contentView}>
          <Text style={styles.statusText}>Eventpool needs a connection to the server in order to work properly.</Text>
          <Text></Text>
          <Text style={styles.statusText}>{props.stateMessage}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Close" onPress={props.onClose} color={colors.green} />
          </View>
        </View>
      </LinearGradient>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    height: Dimensions.get("screen").height / 2,
    minHeight: 260,
    padding: 0,
    marginHorizontal: 20,
    marginTop: Dimensions.get("screen").height / 4,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.white,
    justifyContent: "space-evenly",
    alignItems: "center",
    textAlign: "center",
    alignContent: "center",
  },
  contentView: {
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  statusText: {
    textAlign: "center",
    fontSize: 20,
  },
  buttonContainer: {
    width: Dimensions.get("screen").width / 3,
    marginVertical: 10,
  },
});
export default ConnectionState;
