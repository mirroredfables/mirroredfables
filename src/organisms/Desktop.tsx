// A windows 95 style desktop for the browser, written in React Native and Typescript.

import * as React from "react";
import { View, StyleSheet } from "react-native";
import DesktopShortcut, {
  DesktopShortcutProps,
} from "../molecules/Desktop/DesktopShortcut";
import DesktopBackground, {
  DesktopBackgroundProps,
} from "../molecules/Desktop/DesktopBackground";

export interface DesktopProps {
  shortcuts: DesktopShortcutProps[];
  background: DesktopBackgroundProps;
}

export default function Desktop(props: DesktopProps) {
  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    shortcutsContainer: {
      flex: 1,
      flexDirection: "row",
    },
    shortcutsView: {
      flexShrink: 1,
      flexDirection: "column",
      flexWrap: "wrap",
    },
  });

  return (
    <View style={styles.container}>
      <DesktopBackground {...props.background}>
        <View style={styles.shortcutsContainer}>
          <View style={styles.shortcutsView}>
            {props.shortcuts.map((shortcut, index) => (
              <DesktopShortcut key={index} {...shortcut} />
            ))}
          </View>
        </View>
      </DesktopBackground>
    </View>
  );
}
