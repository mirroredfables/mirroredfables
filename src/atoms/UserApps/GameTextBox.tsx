// A visual novel game's text box, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, View } from "react-native";
import { Text } from "react95-native";

export interface GameTextBoxProps {
  text: string;
  style?: {};
  textStyle?: {};
}

export default function GameTextBox(props: GameTextBoxProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "rgba(52, 52, 52, 0.8)",
    },
    text: {
      margin: 10,
      color: "white",
      fontSize: 18,
    },
  });

  return (
    <View style={[styles.container, props.style]}>
      <Text style={[styles.text, props.textStyle]}>{props.text}</Text>
    </View>
  );
}
