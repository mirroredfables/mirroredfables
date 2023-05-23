// A windows 95 style start menu item, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, Image, Pressable } from "react-native";
import { Text, useTheme } from "react95-native";

export interface StartMenuItemProps {
  icon: string;
  name: string;
  onPress: () => void;
}

export default function StartMenuItem(props: StartMenuItemProps) {
  const [selected, setSelected] = React.useState(false);
  const theme = useTheme();

  const styles = StyleSheet.create({
    buttonView: {
      height: 44,
      flexDirection: "row",
      backgroundColor: selected ? theme.hoverBackground : theme.material,
    },
    icon: {
      width: 32,
      height: 32,
      margin: 6,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
    shortcutTextView: {
      flex: 1,
    },
    shortcutText: {
      margin: 6,
      alignSelf: "center",
    },
  });

  return (
    <Pressable
      style={styles.buttonView}
      onPress={props.onPress}
      onPressIn={() => setSelected(true)}
      onPressOut={() => setSelected(false)}
    >
      <Image source={{ uri: props.icon }} style={styles.icon} />
      <Text
        numberOfLines={1}
        ellipsizeMode={"tail"}
        style={styles.shortcutText}
      >
        {props.name}
      </Text>
    </Pressable>
  );
}
