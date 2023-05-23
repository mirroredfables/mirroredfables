// A visual novel game's start menu button, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, Pressable } from "react-native";

import { Text } from "react95-native";

export interface GameStartButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  style?: {};
  textStyle?: {};
}

export default function GameStartButton(props: GameStartButtonProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      margin: 5,
      color: "white",
      fontSize: 36,
      textShadowColor: "black",
      textShadowRadius: 2,
      //   textShadowOffset: { width: 1, height: 1 },
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
