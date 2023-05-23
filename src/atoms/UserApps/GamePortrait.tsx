// A visual novel game's character portrait, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, Image } from "react-native";

export interface GamePortraitProps {
  id: number;
  name: string;
  image: string;
  active?: boolean;
  style?: {};
  resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center";
}

export default function GamePortrait(props: GamePortraitProps) {
  const styles = StyleSheet.create({
    imageDefault: {
      height: "100%",
      aspectRatio: 2 / 3,
    },
    active: {
      opacity: props.active ? 1 : 0.5,
      //   flexGrow: props.active ? 1 : 0,
      flexShrink: props.active ? 0 : 1,
    },
  });

  return (
    <Image
      source={{ uri: props.image }}
      style={[styles.imageDefault, styles.active, props.style]}
      resizeMode={props.resizeMode || "cover"}
      key={props.name}
    />
  );
}
