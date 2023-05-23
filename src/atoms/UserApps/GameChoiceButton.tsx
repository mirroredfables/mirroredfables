// A visual novel game's choice button, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, Pressable } from "react-native";

import { Text } from "react95-native";

export interface GameChoiceButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  style?: {};
  textStyle?: {};
}

export default function GameChoiceButton(props: GameChoiceButtonProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: props.disabled
        ? "rgba(128, 128, 128, 0.8)"
        : "rgba(0, 75, 200, 0.8)",
      margin: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      margin: 5,
      color: "white",
    },
  });

  return (
    <Pressable
      style={[styles.container, props.style]}
      onPress={props.onPress}
      disabled={props.disabled}
    >
      <Text style={[styles.text, props.textStyle]}>{props.text}</Text>
    </Pressable>
  );
}
