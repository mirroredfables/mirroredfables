// A windows 95 style desktop background, written in React Native and Typescript.

import * as React from "react";

import { View, StyleSheet, ImageBackground } from "react-native";

export interface DesktopBackgroundProps {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundImageResizeMode?:
    | "cover"
    | "contain"
    | "stretch"
    | "repeat"
    | "center";
  foregroundImage?: string;
  foregroundImageResizeMode?:
    | "cover"
    | "contain"
    | "stretch"
    | "repeat"
    | "center";
  children?: React.ReactNode;
}

export default function DesktopBackground(props: DesktopBackgroundProps) {
  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: props.backgroundColor || "transparent",
    },
    background: {
      height: "100%",
      width: "100%",
      justifyContent: "center",
    },
    foreground: {
      height: "100%",
      width: "100%",
      justifyContent: "center",
    },
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: props.backgroundImage }}
        resizeMode={props.backgroundImageResizeMode || "center"}
        style={styles.background}
      >
        <ImageBackground
          source={{ uri: props.foregroundImage }}
          resizeMode={props.foregroundImageResizeMode || "center"}
          style={styles.foreground}
        >
          {props.children}
        </ImageBackground>
      </ImageBackground>
    </View>
  );
}
