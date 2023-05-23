// A windows 95 style system settings app for the browser, written in React Native and Typescript.

import * as React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Tabs, Text } from "react95-native";
import { DesktopBackgroundProps } from "../../molecules/Desktop/DesktopBackground";
import DesktopBackgroundSettings from "../../molecules/SystemApps/DesktopBackgroundSettings";
import ThemeSettings from "../../molecules/SystemApps/ThemeSettings";

interface SystemSettingsProps {
  currentTheme: string;
  setTheme: (theme: string) => void;
  currentBackground: DesktopBackgroundProps;
  setBackground: (background: DesktopBackgroundProps) => void;
}

export default function SystemSettings(props: SystemSettingsProps) {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    tabContainer: {
      flex: 1,
      padding: 4,
    },
    tabNameView: {},
  });

  const CurrentTab = () => {
    switch (selectedTab) {
      case 0:
        return (
          <ThemeSettings
            currentTheme={props.currentTheme}
            setTheme={props.setTheme}
          />
        );
      case 1:
        return (
          <DesktopBackgroundSettings
            currentBackground={props.currentBackground}
            setBackground={props.setBackground}
          />
        );
      default:
        return <Text>no settings tab selected</Text>;
    }
  };

  // TODO: Hacky! This is because Tabs.Tab is broken on the web, as it's unclickable
  const TabNameView = (props: { name: string; index: number }) => {
    return (
      <Pressable
        style={styles.tabNameView}
        onPress={() => setSelectedTab(props.index)}
      >
        <Text>{props.name}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Tabs value={selectedTab} onChange={setSelectedTab}>
        <Tabs.Tab value={0}>
          <TabNameView name={"theme"} index={0} />
        </Tabs.Tab>
        <Tabs.Tab value={1}>
          <TabNameView name={"desktop"} index={1} />
        </Tabs.Tab>
      </Tabs>
      <Tabs.Body style={styles.tabContainer}>
        <CurrentTab />
      </Tabs.Body>
    </View>
  );
}
