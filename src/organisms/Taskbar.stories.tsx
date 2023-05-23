import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import Taskbar from "./Taskbar";
import { defaultStartMenu } from "../molecules/Taskbar/StartMenu.stories";
import {
  defaultTaskbarButton,
  inactiveTaskbarButton,
} from "../molecules/Taskbar/TaskbarButton.stories";
import { defaultNotificationButton } from "../molecules/Taskbar/NotificationButton.stories";

const TaskbarMeta: ComponentMeta<typeof Taskbar> = {
  title: "Organisms/Taskbar",
  component: Taskbar,
  argTypes: {},
  args: {
    startMenu: defaultStartMenu,
    taskbarButtons: [
      defaultTaskbarButton,
      inactiveTaskbarButton,
      inactiveTaskbarButton,
    ],
    notificationButtons: [
      defaultNotificationButton,
      defaultNotificationButton,
      defaultNotificationButton,
    ],
  },
};

export default TaskbarMeta;

type TaskbarStory = ComponentStory<typeof Taskbar>;

export const Default: TaskbarStory = (args) => <Taskbar {...args} />;
