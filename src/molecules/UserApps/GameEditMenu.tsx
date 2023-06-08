// A visual novel game's edit menu, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, View, Pressable, TextInput } from "react-native";
import { Text } from "react95-native";

export interface GameEditMenuProps {
  speaker: string;
  defaultValue: string;
  onCancelPressed: () => void;
  onSavePressed: (newValue: string) => void;
}

export default function GameEditMenu(props: GameEditMenuProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    innerContainer: {
      flex: 1,
      margin: 20,
    },
    speakerText: {
      margin: 5,
      color: "white",
    },
    textInput: {
      flex: 1,
      margin: 5,
      padding: 4,
      fontFamily: "MS Sans Serif",
      fontSize: 16,
      placeholderTextColor: "gray",
      color: "white",
      backgroundColor: "rgba(0, 75, 200, 0.8)",
    },
    buttonsContainer: {
      flexDirection: "row",
    },
    button: {
      flex: 1,
      backgroundColor: "rgba(0, 75, 200, 0.8)",
      margin: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonLabel: {
      margin: 5,
      color: "white",
    },
  });

  const [editedText, setEditedText] = React.useState(props.defaultValue);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.speakerText}>{props.speaker}</Text>
        <TextInput
          style={styles.textInput}
          placeholder={props.defaultValue}
          value={editedText}
          onChangeText={(newValue) => {
            setEditedText(newValue);
          }}
          multiline={true}
        />
        <View style={styles.buttonsContainer}>
          <Pressable style={styles.button} onPress={props.onCancelPressed}>
            <Text style={styles.buttonLabel}>cancel</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() =>
              props.onSavePressed(`${props.speaker} ${editedText}`)
            }
          >
            <Text style={styles.buttonLabel}>save and update</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
