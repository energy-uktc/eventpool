import { Provider } from "react-redux";
import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Events from "./screens/Events";
import AppLoading from 'expo-app-loading';
import * as Font from "expo-font";
import store from "./store/store";

const fetchFonts = () => {
  return Font.loadAsync({
    "georgia": require("./assets/fonts/georgia.ttf"),
    "georgia-italic": require("./assets/fonts/georgia-italic.ttf"),
    "georgia-bold": require("./assets/fonts/georgia-bold.ttf"),
    "georgia-bold-italic": require("./assets/fonts/georgia-bold-italic.ttf"),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
        onError={console.warn}
      />
    );
  }
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Events />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
