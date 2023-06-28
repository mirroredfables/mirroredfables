// A windows 95 style desktop shortcut, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, Image, Pressable } from "react-native";
import { Text, useTheme } from "react95-native";

export interface DesktopShortcutProps {
  icon: string;
  name: string;
  onPress: () => void;
  // should it have a onSelected? For single click vs double click?
  // or onLongPress?
}

export default function DesktopShortcut(props: DesktopShortcutProps) {
  const [selected, setSelected] = React.useState(false);
  const theme = useTheme();

  const styles = StyleSheet.create({
    shortcut: {
      width: 80,
      height: 88,
      margin: 4,
      backgroundColor: selected ? theme.hoverBackground : "transparent",
    },
    icon: {
      width: 32,
      height: 32,
      marginTop: 12,
      marginBottom: 4,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
    shortcutText: {
      textAlign: "center",
      color: "white",
      textShadowColor: "black",
      textShadowOffset: { width: 1, height: 1 },
    },
  });

  return (
    <Pressable
      onPressIn={() => setSelected(true)}
      onPressOut={() => {
        setSelected(false);
      }}
      onPress={props.onPress}
      style={styles.shortcut}
    >
      <Image source={{ uri: props.icon }} style={styles.icon} />
      <Text numberOfLines={2} style={styles.shortcutText}>
        {props.name}
      </Text>
    </Pressable>
  );
}
