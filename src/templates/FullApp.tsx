// A windows 95 style desktop for the browser, written in React Native and Typescript.

import * as React from "react";
import { View, StyleSheet } from "react-native";
import Desktop, { DesktopProps } from "../organisms/Desktop";
import SystemSnackbar, {
  SystemSnackbarProps,
} from "../organisms/SystemSnackbar";
import Taskbar, { TaskbarProps } from "../organisms/Taskbar";
import Window, { WindowProps } from "../molecules/Window/Window";

interface FullAppProps {
  desktop: DesktopProps;
  taskbar: TaskbarProps;
  windows: WindowProps[];
  systemSnackbar: SystemSnackbarProps;
}

export default function FullApp(props: FullAppProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      overflow: "hidden",
    },
    desktopContainer: {
      flexGrow: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.desktopContainer}>
        <Desktop
          shortcuts={props.desktop.shortcuts}
          background={props.desktop.background}
        />
        {props.windows.map((window) => (
          <Window
            name={window.name}
            key={window.state.id}
            icon={window.icon}
            children={window.children}
            state={window.state}
            manager={window.manager}
          />
        ))}
      </View>
      <Taskbar
        startMenu={props.taskbar.startMenu}
        taskbarButtons={props.taskbar.taskbarButtons}
        notificationButtons={props.taskbar.notificationButtons}
        hidden={props.taskbar.hidden}
      />
      <SystemSnackbar
        message={props.systemSnackbar.message}
        visible={props.systemSnackbar.visible}
        onDismiss={props.systemSnackbar.onDismiss}
      />
    </View>
  );
}
