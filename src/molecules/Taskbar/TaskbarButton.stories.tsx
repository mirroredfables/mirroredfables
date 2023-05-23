import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import TaskbarButton, { TaskbarButtonProps } from "./TaskbarButton";

export const defaultTaskbarButton: TaskbarButtonProps = {
  id: 1,
  name: "cat.exe",
  icon: "https://placekitten.com/16/16",
  active: true,
  onPress: () => {
    console.log("cat.exe pressed");
  },
};

export const inactiveTaskbarButton: TaskbarButtonProps = {
  id: 2,
  icon: "https://placekitten.com/16/16",
  name: "cat.exe",
  active: false,
  onPress: () => {
    console.log("cat.exe pressed");
  },
};

const TaskbarButtonMeta: ComponentMeta<typeof TaskbarButton> = {
  title: "Molecules/Taskbar/TaskbarButton",
  component: TaskbarButton,
  argTypes: {},
  args: defaultTaskbarButton,
};

export default TaskbarButtonMeta;

type TaskbarButtonStory = ComponentStory<typeof TaskbarButton>;

export const Active: TaskbarButtonStory = (args) => <TaskbarButton {...args} />;

export const Inactive: TaskbarButtonStory = (args) => (
  <TaskbarButton {...args} active={false} />
);

export const LongName: TaskbarButtonStory = (args) => (
  <TaskbarButton {...args} active={false} name={"long long long cat.exe"} />
);
