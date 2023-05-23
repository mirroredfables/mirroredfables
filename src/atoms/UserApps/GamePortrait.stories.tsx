import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import GamePortrait from "./GamePortrait";

export const defaultGamePortrait = {
  id: 0,
  image:
    "https://imagedelivery.net/b5mSegxdhZuzmzCIP5eRsQ/7826eae0-9a7b-4191-e890-f0a32eb54d00/public",
  name: "girl",
  active: true,
};

const GamePortraitMeta: ComponentMeta<typeof GamePortrait> = {
  title: "Atoms/UserApps/GamePortrait",
  component: GamePortrait,
  argTypes: {},
  args: defaultGamePortrait,
};

export default GamePortraitMeta;

type GamePortraitStory = ComponentStory<typeof GamePortrait>;

export const Default: GamePortraitStory = (args) => <GamePortrait {...args} />;

export const Inactive: GamePortraitStory = (args) => (
  <GamePortrait {...args} active={false} />
);
