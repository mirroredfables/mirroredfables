import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import WindowTitleButton, { WindowTitleButtonProps } from "./WindowTitleButton";

export const defaultWindowTitleButton: WindowTitleButtonProps = {
  name: "close",
  icon: "window-close",
  onPress: () => {
    console.log("window title close button pressed");
  },
};

const WindowTitleButtonMeta: ComponentMeta<typeof WindowTitleButton> = {
  title: "Atoms/Window/WindowTitleButton",
  component: WindowTitleButton,
  argTypes: {},
  args: defaultWindowTitleButton,
};

export default WindowTitleButtonMeta;

type WindowTitleButtonStory = ComponentStory<typeof WindowTitleButton>;

export const Close: WindowTitleButtonStory = (args) => (
  <WindowTitleButton {...args} />
);

export const Minimize: WindowTitleButtonStory = (args) => (
  <WindowTitleButton {...args} name="minimize" icon="window-minimize" />
);

export const Maximize: WindowTitleButtonStory = (args) => (
  <WindowTitleButton {...args} name="maximize" icon="window-maximize" />
);

export const Restore: WindowTitleButtonStory = (args) => (
  <WindowTitleButton {...args} name="restore" icon="window-restore" />
);
