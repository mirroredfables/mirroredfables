import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import GameBackground from "./GameBackground";

export const defaultGameBackground = {
  image:
    "https://imagedelivery.net/b5mSegxdhZuzmzCIP5eRsQ/33495ef6-c0fc-4f1f-f30c-254188e63800/public",
  name: "exterior new york city",
};

const GameBackgroundMeta: ComponentMeta<typeof GameBackground> = {
  title: "Atoms/UserApps/GameBackground",
  component: GameBackground,
  argTypes: {},
  args: defaultGameBackground,
};

export default GameBackgroundMeta;

type GameBackgroundStory = ComponentStory<typeof GameBackground>;

export const Default: GameBackgroundStory = (args) => (
  <GameBackground {...args} />
);
