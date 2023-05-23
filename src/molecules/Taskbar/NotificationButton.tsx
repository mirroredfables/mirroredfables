// A windows 95 style notification button, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, Image, Pressable } from "react-native";
import { useTheme } from "react95-native";

export interface NotificationButtonProps {
  icon: string;
  name: string;
  onPress: () => void;
}

export default function NotificationButton(props: NotificationButtonProps) {
  const [selected, setSelected] = React.useState(false);
  const theme = useTheme();

  const styles = StyleSheet.create({
    button: {
      width: 24,
      height: 24,
      backgroundColor: selected ? theme.hoverBackground : "transparent",
    },
    icon: {
      margin: 4,
      width: 16,
      height: 16,
    },
  });

  return (
    <Pressable
      onPressIn={() => setSelected(true)}
      onPressOut={() => {
        setSelected(false);
      }}
      onPress={props.onPress}
      style={styles.button}
    >
      <Image source={{ uri: props.icon }} style={styles.icon} />
    </Pressable>
  );
}
