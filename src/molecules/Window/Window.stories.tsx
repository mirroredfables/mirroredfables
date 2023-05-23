import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import Window from "./Window";

const WindowMeta: ComponentMeta<typeof Window> = {
  title: "Molecules/Window",
  component: Window,
  argTypes: {},
  args: {
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
};

export default WindowMeta;

type WindowStory = ComponentStory<typeof Window>;

export const Default: WindowStory = (args) => <Window {...args} />;
export const LongTitle: WindowStory = (args) => (
  <Window
    {...args}
    name={
      "long long long long long long long long long long long long long long"
    }
  />
);
export const Maximized: WindowStory = (args) => (
  <Window
    {...args}
    state={{
      id: 1,
      depth: 0,
      active: true,
      maximized: true,
      minimized: false,
      fullscreened: false,
      resizable: true,
      width: 400,
      height: 400,
      positionX: 0,
      positionY: 0,
    }}
  />
);
export const Minimized: WindowStory = (args) => (
  <Window
    {...args}
    state={{
      id: 1,
      depth: 0,
      active: true,
      maximized: false,
      minimized: true,
      fullscreened: false,
      resizable: true,
      width: 400,
      height: 400,
      positionX: 0,
      positionY: 0,
    }}
  />
);
export const Inactive: WindowStory = (args) => (
  <Window
    {...args}
    state={{
      id: 1,
      depth: 0,
      active: false,
      maximized: false,
      minimized: false,
      fullscreened: false,
      resizable: true,
      width: 400,
      height: 400,
      positionX: 0,
      positionY: 0,
    }}
  />
);
export const FullScreen: WindowStory = (args) => (
  <Window
    {...args}
    state={{
      id: 1,
      depth: 0,
      active: false,
      maximized: false,
      minimized: false,
      fullscreened: true,
      resizable: true,
      width: 400,
      height: 400,
      positionX: 0,
      positionY: 0,
    }}
  />
);
