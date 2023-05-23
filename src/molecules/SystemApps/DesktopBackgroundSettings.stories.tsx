import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import DesktopBackgroundSettings from "./DesktopBackgroundSettings";
import { defaultDesktopBackground } from "../Desktop/DesktopBackground.stories";

const DesktopBackgroundSettingsMeta: ComponentMeta<
  typeof DesktopBackgroundSettings
> = {
  title: "Molecules/SystemApps/DesktopBackgroundSettings",
  component: DesktopBackgroundSettings,
  argTypes: {},
  args: {
    currentBackground: defaultDesktopBackground,
    setBackground: (background) => {
      console.log("background changed to: " + background);
    },
  },
};

export default DesktopBackgroundSettingsMeta;

type DesktopBackgroundSettingsStory = ComponentStory<
  typeof DesktopBackgroundSettings
>;

export const Default: DesktopBackgroundSettingsStory = (args) => (
  <DesktopBackgroundSettings {...args} />
);
