// A windows 95 style game launcher app for the browser, written in React Native and Typescript.

import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Fieldset, Button } from "react95-native";
import TextInput from "../../atoms/TextInput";

interface VisualNovelGameLauncherProps {
  onLaunchGameFromUrl: (gameSaveUrl: string) => void;
}

export default function VisualNovelGameLauncher(
  props: VisualNovelGameLauncherProps
) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    fieldSetContainer: {
      margin: 4,
    },
    submitButton: {
      margin: 4,
    },
  });

  const [gameSaveUrl, setGameSaveUrl] = React.useState("");

  return (
    <View style={styles.container}>
      <Fieldset label="game save file url:" style={styles.fieldSetContainer}>
        <TextInput
          autoCapitalize={"none"}
          placeholder={"https://example.com/game.json"}
          value={gameSaveUrl}
          onChangeText={(newValue) => {
            setGameSaveUrl(newValue);
          }}
        />
      </Fieldset>
      <Button
        style={styles.submitButton}
        // onPress={() => {
        //     fetch(gameSaveUrl)
        //       .then((response) => response.json())
        //       .then((json) => {
        //         props.onLaunchGameFromUrl(json);
        //       })
        //       .catch((error) => {
        //         console.error(error);
        //       });
        //   }}
        onPress={() => {
          props.onLaunchGameFromUrl(gameSaveUrl);
        }}
      >
        launch
      </Button>
    </View>
  );
}
