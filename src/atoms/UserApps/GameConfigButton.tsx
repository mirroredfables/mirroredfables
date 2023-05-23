// A visual novel game's config button, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, Pressable } from "react-native";
// import { FontAwesome } from "@expo/vector-icons";
import FontAwesome from "../SystemApps/MyFontAwesome";

export interface GameConfigButtonProps {
  onPress: () => void;
  style?: {};
  color?: string;
}

export default function GameConfigButton(props: GameConfigButtonProps) {
  const styles = StyleSheet.create({
    container: {
      height: 24,
      width: 24,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <Pressable style={[styles.container, props.style]} onPress={props.onPress}>
      <FontAwesome name={"gear"} size={16} color={props.color || "white"} />
    </Pressable>
  );
}
