import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import DesktopBackground, { DesktopBackgroundProps } from "./DesktopBackground";

export const defaultDesktopBackground: DesktopBackgroundProps = {
  backgroundColor: "grey",
  backgroundImage: "https://placekitten.com/200/200",
  backgroundImageResizeMode: "center",
  foregroundImage:
    "https://imagedelivery.net/b5mSegxdhZuzmzCIP5eRsQ/42683d60-f0b2-419c-01b3-af41c4171700/public",
  foregroundImageResizeMode: "cover",
  children: null,
};

export const danFlashesDesktopBackground: DesktopBackgroundProps = {
  backgroundColor: "black",
  backgroundImage: "https://placekitten.com/100/100",
  backgroundImageResizeMode: "repeat",
  foregroundImage: "https://placekitten.com/200/200",
  foregroundImageResizeMode: "center",
  children: null,
};

const DesktopBackgroundMeta: ComponentMeta<typeof DesktopBackground> = {
  title: "Molecules/Desktop/DesktopBackground",
  component: DesktopBackground,
  argTypes: {},
  args: defaultDesktopBackground,
};

export default DesktopBackgroundMeta;

type DesktopBackgroundStory = ComponentStory<typeof DesktopBackground>;

export const Default: DesktopBackgroundStory = (args) => (
  <DesktopBackground {...args} />
);

export const DanFlashes: DesktopBackgroundStory = (args) => (
  <DesktopBackground
    {...args}
    backgroundImage={danFlashesDesktopBackground.backgroundImage}
  />
);
