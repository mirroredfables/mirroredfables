// A windows 95 style theme settings app for the browser, written in React Native and Typescript.

import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Panel, ScrollView, themes } from "react95-native";

import ThemeButton from "../../atoms/SystemApps/ThemeButton";

export interface ThemeSettingsProps {
  currentTheme: string;
  setTheme: (theme: string) => void;
  themeButtonWidth?: number;
}

export default function ThemeSettings(props: ThemeSettingsProps) {
  const currentTheme = props.currentTheme;
  const themeButtonWidth = props.themeButtonWidth || 100;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    buttonView: {
      flexShrink: 1,
    },
    insideContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      margin: 4,
    },
  });

  return (
    <ScrollView style={styles.container} alwaysShowScrollbars={true}>
      <View style={styles.insideContainer}>
        {Object.values(themes).map((theme) => (
          <View style={styles.buttonView} key={theme.name}>
            <ThemeButton
              theme={theme}
              currentTheme={themes[currentTheme || "original"]}
              selected={theme.name === currentTheme}
              onPress={() => props.setTheme(theme.name)}
              width={themeButtonWidth}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
