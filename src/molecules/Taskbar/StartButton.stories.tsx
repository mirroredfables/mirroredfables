import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import StartButton, { StartButtonProps } from "./StartButton";

export const defaultStartButton: StartButtonProps = {
  icon: "https://placekitten.com/16/16",
  name: "start",
  active: false,
  onPress: () => {
    console.log("start button pressed");
  },
};

const StartButtonMeta: ComponentMeta<typeof StartButton> = {
  title: "Molecules/Taskbar/StartButton",
  component: StartButton,
  argTypes: {},
  args: defaultStartButton,
};

export default StartButtonMeta;

type StartButtonStory = ComponentStory<typeof StartButton>;

export const Active: StartButtonStory = (args) => (
  <StartButton {...args} active={true} />
);

export const Inactive: StartButtonStory = (args) => (
  <StartButton {...args} active={false} />
);
