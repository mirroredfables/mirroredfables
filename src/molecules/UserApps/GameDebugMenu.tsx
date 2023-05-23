// A visual novel game's debug menu, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { Text } from "react95-native";

export interface GameDebugMenuProps {
  text: string;
  buttons: {
    name: string;
    onPress: () => void;
  }[];
}

export default function GameDebugMenu(props: GameDebugMenuProps) {
  const styles = StyleSheet.create({
    container: {
      margin: 5,
      height: 80,
    },
    textContainer: {
      margin: 5,
    },
    text: {
      color: "white",
    },
    rowContainer: {
      flex: 1,
    },
    button: {
      flex: 1,
      margin: 5,
      height: 40,
      backgroundColor: "rgba(139, 0, 0, 0.8)",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{props.text}</Text>
      </View>
      <ScrollView style={styles.rowContainer} horizontal={true}>
        {props.buttons.map((button, index) => (
          <Pressable style={styles.button} onPress={button.onPress} key={index}>
            <Text style={styles.text}>{button.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
