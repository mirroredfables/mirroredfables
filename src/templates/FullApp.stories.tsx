import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import FullApp from "./FullApp";
import { defaultDesktopShortcut } from "../molecules/Desktop/DesktopShortcut.stories";
import { defaultDesktopBackground } from "../molecules/Desktop/DesktopBackground.stories";
import { defaultStartMenu } from "../molecules/Taskbar/StartMenu.stories";
import {
  defaultTaskbarButton,
  inactiveTaskbarButton,
} from "../molecules/Taskbar/TaskbarButton.stories";
import { defaultNotificationButton } from "../molecules/Taskbar/NotificationButton.stories";

const FullAppMeta: ComponentMeta<typeof FullApp> = {
  title: "Pages/FullApp",
  component: FullApp,
  argTypes: {},
  args: {
    desktop: {
      shortcuts: [
        defaultDesktopShortcut,
        defaultDesktopShortcut,
        defaultDesktopShortcut,
      ],
      background: defaultDesktopBackground,
    },
    taskbar: {
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
    windows: [
      {
        name: "Window",
        icon: "https://placekitten.com/16/16",
        children: <></>,
        state: {
          id: 1,
          depth: 0,
          active: true,
          maximized: false,
          minimized: false,
          fullscreened: false,
          resizable: true,
          width: 400,
          height: 400,
          positionX: 0,
          positionY: 0,
        },
        manager: {
          minimize: () => {},
          maximize: () => {},
          fullscreen: () => {},
          exitFullscreen: () => {},
          restore: () => {},
          close: () => {},
          resize: (width: number, height: number) => {},
          move: (x: number, y: number) => {},
          activate: () => {},
        },
      },
      {
        name: "Window",
        icon: "https://placekitten.com/16/16",
        children: <></>,
        state: {
          id: 1,
          depth: 0,
          active: true,
          maximized: false,
          minimized: false,
          fullscreened: false,
          resizable: true,
          width: 600,
          height: 400,
          positionX: 100,
          positionY: 200,
        },
        manager: {
          minimize: () => {},
          maximize: () => {},
          fullscreen: () => {},
          exitFullscreen: () => {},
          restore: () => {},
          close: () => {},
          resize: (width: number, height: number) => {},
          move: (x: number, y: number) => {},
          activate: () => {},
        },
      },
    ],
    systemSnackbar: {
      message: "Hello World",
      visible: true,
    },
  },
};

export default FullAppMeta;

type FullAppStory = ComponentStory<typeof FullApp>;

export const Default: FullAppStory = (args) => <FullApp {...args} />;
