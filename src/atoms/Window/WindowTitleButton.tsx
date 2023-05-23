// A windows 95 style windows title button, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet } from "react-native";
import { Button, useTheme } from "react95-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "../SystemApps/MyMaterialCommunityIcons";

export interface WindowTitleButtonProps {
  name: string;
  icon: string;
  onPress: () => void;
}

export default function WindowTitleButton(props: WindowTitleButtonProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    button: {
      alignItems: "center",
      aspectRatio: 1,
      height: 24,
      width: 24,
    },
  });

  return (
    <Button onPress={props.onPress} style={styles.button} square={true}>
      <MaterialCommunityIcons
        name={props.icon}
        size={16}
        color={theme.materialText}
      />
    </Button>
  );
}
