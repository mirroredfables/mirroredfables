// A windows 95 style taskbar for the browser, written in React Native and Typescript.

import * as React from "react";
import { View, StyleSheet } from "react-native";
import { AppBar, Toolbar, Divider, Panel } from "react95-native";
import TaskbarButton, {
  TaskbarButtonProps,
} from "../molecules/Taskbar/TaskbarButton";
import StartMenu, { StartMenuProps } from "../molecules/Taskbar/StartMenu";
import NotificationButton, {
  NotificationButtonProps,
} from "../molecules/Taskbar/NotificationButton";
import Clock from "../molecules/Taskbar/Clock";

export interface TaskbarProps {
  startMenu: StartMenuProps;
  taskbarButtons: TaskbarButtonProps[];
  notificationButtons: NotificationButtonProps[];
  hidden?: boolean;
}

export default function Taskbar(props: TaskbarProps) {
  const styles = StyleSheet.create({
    container: {
      display: props.hidden ? "none" : "flex",
      width: "100%",
      flexDirection: "row",
    },
    divider: {
      marginHorizontal: 4,
    },
    taskbarButtonsGroupView: {
      flex: 1,
    },
    taskbarButtonView: {
      marginRight: 4,
    },
    notificationPanel: {
      flexDirection: "row",
      height: 34,
      margin: 4,
      marginRight: 0,
      alignItems: "center",
    },
    notificationButtonView: {},
    clockView: {
      margin: 4,
    },
  });

  // TODO: BUG - when too many taskbar buttons, on Web, cannot scroll with mouse, only touch

  return (
    <AppBar style={styles.container}>
      <StartMenu {...props.startMenu} />
      <Divider orientation={"vertical"} style={styles.divider} />
      <View style={styles.taskbarButtonsGroupView}>
        <Toolbar>
          {props.taskbarButtons.map((taskbarButton, index) => (
            <View key={index} style={styles.taskbarButtonView}>
              <TaskbarButton key={index} {...taskbarButton} />
            </View>
          ))}
        </Toolbar>
      </View>
      <Panel variant="well" style={styles.notificationPanel}>
        {props.notificationButtons.map((notificationButton, index) => (
          <View key={index} style={styles.notificationButtonView}>
            <NotificationButton key={index} {...notificationButton} />
          </View>
        ))}
        <View style={styles.clockView}>
          <Clock />
        </View>
      </Panel>
    </AppBar>
  );
}
