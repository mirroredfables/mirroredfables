import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import { themes } from "react95-native";
import ThemeButton, { ThemeButtonProps } from "./ThemeButton";

const theme = themes["original"];

export const defaultThemeButton: ThemeButtonProps = {
  onPress: () => {
    console.log("theme button pressed");
  },
  selected: false,
  theme: theme,
  currentTheme: theme,
};

const ThemeButtonMeta: ComponentMeta<typeof ThemeButton> = {
  title: "Atoms/SystemApps/ThemeButton",
  component: ThemeButton,
  argTypes: {},
  args: defaultThemeButton,
};

export default ThemeButtonMeta;

type ThemeButtonStory = ComponentStory<typeof ThemeButton>;

export const Selected: ThemeButtonStory = (args) => (
  <ThemeButton {...args} selected={true} />
);
