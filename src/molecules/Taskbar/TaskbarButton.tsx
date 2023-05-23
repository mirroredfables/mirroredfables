// A windows 95 style taskbar button, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, View, Image } from "react-native";
import { Text, Button } from "react95-native";

export interface TaskbarButtonProps {
  id: number;
  name: string;
  icon: string;
  active: boolean;
  onPress: () => void;
  // should it have a onSelected? For single click vs double click?
  // or onLongPress?
}

export default function TaskbarButton(props: TaskbarButtonProps) {
  const styles = StyleSheet.create({
    button: {
      width: 100,
      overflow: "hidden",
      alignItems: "flex-start",
    },
    buttonView: {
      flexDirection: "row",
    },
    icon: {
      width: 16,
      height: 16,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
    shortcutText: {
      maxWidth: 100 - 8 - 16 - 4 - 4, // TODO: hacky
      marginLeft: 4,
      marginRight: 4,
    },
  });

  return (
    <Button onPress={props.onPress} active={props.active} style={styles.button}>
      <View style={styles.buttonView}>
        <Image source={{ uri: props.icon }} style={styles.icon} />
        <Text
          numberOfLines={1}
          ellipsizeMode={"tail"}
          style={styles.shortcutText}
        >
          {props.name}
        </Text>
      </View>
    </Button>
  );
}
