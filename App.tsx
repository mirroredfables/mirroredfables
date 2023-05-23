import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import { useFonts } from "expo-font";
import { fontNames } from "react95-native";
import { StatusBar } from "expo-status-bar";
import StorybookUIRoot from "./.ondevice/index";
import store from "./src/redux/Store";
import HomeScreen from "./src/pages/HomeScreen";

export default function App() {
  const [fontLoaded] = useFonts({
    [fontNames.normal]: require("./public/fonts/MS-Sans-Serif.ttf"),
    [fontNames.bold]: require("./public/fonts/MS-Sans-Serif-Bold.ttf"),
    FontAwesome: require("./public/fonts/FontAwesome.ttf"),
    MaterialCommunityIcons: require("./public/fonts/MaterialCommunityIcons.ttf"),
  });

  if (!fontLoaded) {
    return <></>;
  }

  return (
    <Provider store={store}>
      {/* <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
        <StorybookScreen />
      </View> */}
      <HomeScreen />
    </Provider>
  );
}

// export { StorybookUIRoot as default };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
