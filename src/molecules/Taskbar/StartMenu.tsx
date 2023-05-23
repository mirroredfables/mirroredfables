// A windows 95 style start menu, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, View, Image } from "react-native";
import { Text, Button, Menu } from "react95-native";

import StartButton from "./StartButton";
import StartMenuItem, { StartMenuItemProps } from "./StartMenuItem";

export interface StartMenuProps {
  startButtonIcon: string;
  startButtonName: string;
  items: StartMenuItemProps[];
}

export default function StartMenu(props: StartMenuProps) {
  const [startButtonActive, setStartButtonActive] = React.useState(false);

  const styles = StyleSheet.create({
    menu: {
      left: -8,
      top: -10,
    },
  });

  return (
    <Menu
      open={startButtonActive}
      verticalAlignment="above"
      style={styles.menu}
      anchor={
        <StartButton
          icon={props.startButtonIcon}
          name={props.startButtonName}
          active={startButtonActive}
          onPress={() =>
            setStartButtonActive((startButtonActive) => !startButtonActive)
          }
        />
      }
    >
      {props.items.map((item, index) => (
        <StartMenuItem
          icon={item.icon}
          name={item.name}
          onPress={() => {
            item.onPress();
            setStartButtonActive(false);
          }}
          key={index}
        />
      ))}
    </Menu>
  );
}
