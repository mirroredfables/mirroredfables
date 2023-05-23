import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import Clock from "./Clock";

const ClockMeta: ComponentMeta<typeof Clock> = {
  title: "Molecules/Taskbar/Clock",
  component: Clock,
  argTypes: {},
  args: {},
};

export default ClockMeta;

type ClockStory = ComponentStory<typeof Clock>;

export const Default: ClockStory = (args) => <Clock {...args} />;
