import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import ThemeSettings from "./ThemeSettings";

const ThemeSettingsMeta: ComponentMeta<typeof ThemeSettings> = {
  title: "Molecules/SystemApps/ThemeSettings",
  component: ThemeSettings,
  argTypes: {},
  args: {
    currentTheme: "original",
    setTheme: (theme) => {
      console.log("theme changed to: " + theme);
    },
  },
};

export default ThemeSettingsMeta;

type ThemeSettingsStory = ComponentStory<typeof ThemeSettings>;

export const Default: ThemeSettingsStory = (args) => (
  <ThemeSettings {...args} />
);
