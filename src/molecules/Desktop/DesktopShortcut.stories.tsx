import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import DesktopShortcut, { DesktopShortcutProps } from "./DesktopShortcut";

export const defaultDesktopShortcut: DesktopShortcutProps = {
  icon: "https://placekitten.com/80/80",
  name: "cat.exe",
  onPress: () => {
    console.log("cat.exe pressed");
  },
};

const DesktopShortcutMeta: ComponentMeta<typeof DesktopShortcut> = {
  title: "Molecules/Desktop/DesktopShortcut",
  component: DesktopShortcut,
  argTypes: {},
  args: defaultDesktopShortcut,
};

export default DesktopShortcutMeta;

type DesktopShortcutStory = ComponentStory<typeof DesktopShortcut>;

export const Default: DesktopShortcutStory = (args) => (
  <DesktopShortcut {...args} />
);

export const LongName: DesktopShortcutStory = (args) => (
  <DesktopShortcut {...args} name={"long long long cat.exe"} />
);
