import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import SystemSettings from "./SystemSettings";
import { defaultDesktopBackground } from "../../molecules/Desktop/DesktopBackground.stories";

const SystemSettingsMeta: ComponentMeta<typeof SystemSettings> = {
  title: "Organisms/SystemApps/SystemSettings",
  component: SystemSettings,
  argTypes: {},
  args: {
    currentTheme: "original",
    setTheme: (theme) => {
      console.log("theme changed to: " + theme);
    },
    currentBackground: defaultDesktopBackground,
    setBackground: (background) => {
      console.log("background changed to: " + background);
    },
  },
};

export default SystemSettingsMeta;

type SystemSettingsStory = ComponentStory<typeof SystemSettings>;

export const Default: SystemSettingsStory = (args) => (
  <SystemSettings {...args} />
);
