// A visual novel game's background, written in React Native and Typescript.

import * as React from "react";

import { View, StyleSheet, ImageBackground } from "react-native";

export interface GameBackgroundProps {
  image: string;
  name: string;
  fullscreen?: boolean;
  style?: {};
  resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center";
  children?: React.ReactNode;
}

export default function GameBackground(props: GameBackgroundProps) {
  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      margin: props.fullscreen ? 0 : 4,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "black",
    },
    background: {
      height: "100%",
      width: "100%",
      justifyContent: "center",
    },
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: props.image }}
        resizeMode={props.resizeMode || "cover"}
        style={[styles.background, props.style]}
      >
        {props.children}
      </ImageBackground>
    </View>
  );
}
