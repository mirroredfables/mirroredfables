import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import Desktop from "./Desktop";
import { defaultDesktopShortcut } from "../molecules/Desktop/DesktopShortcut.stories";
import { defaultDesktopBackground } from "../molecules/Desktop/DesktopBackground.stories";

const DesktopMeta: ComponentMeta<typeof Desktop> = {
  title: "Organisms/Desktop",
  component: Desktop,
  argTypes: {},
  args: {
    shortcuts: [
      defaultDesktopShortcut,
      defaultDesktopShortcut,
      defaultDesktopShortcut,
      defaultDesktopShortcut,
    ],
    background: defaultDesktopBackground,
  },
};

export default DesktopMeta;

type DesktopStory = ComponentStory<typeof Desktop>;

export const Default: DesktopStory = (args) => <Desktop {...args} />;

export const ManyShortcuts: DesktopStory = (args) => (
  <Desktop
    {...args}
    shortcuts={[
      defaultDesktopShortcut,
      defaultDesktopShortcut,
      defaultDesktopShortcut,
      defaultDesktopShortcut,
      defaultDesktopShortcut,
      defaultDesktopShortcut,
      defaultDesktopShortcut,
      defaultDesktopShortcut,
      defaultDesktopShortcut,
      defaultDesktopShortcut,
      defaultDesktopShortcut,
      defaultDesktopShortcut,
      defaultDesktopShortcut,
      defaultDesktopShortcut,
      defaultDesktopShortcut,
    ]}
  />
);
