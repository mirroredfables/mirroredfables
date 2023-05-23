import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import GameScriptHistory, { GameScriptHistoryProps } from "./GameScriptHistory";
import { defaultGameBackground } from "../../atoms/UserApps/GameBackground.stories";

const sampleTurn = {
  id: 0,
  sceneId: 0,
  type: "speech",
  text: "[Player] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
};

export const defaultGameScriptHistory: GameScriptHistoryProps = {
  background: defaultGameBackground,
  turns: [sampleTurn, sampleTurn, sampleTurn],
  onBackPressed: () => {
    console.log("back button pressed");
  },
};

const GameScriptHistoryMeta: ComponentMeta<typeof GameScriptHistory> = {
  title: "Molecules/UserApps/GameScriptHistory",
  component: GameScriptHistory,
  argTypes: {},
  args: defaultGameScriptHistory,
};

export default GameScriptHistoryMeta;

type GameScriptHistoryStory = ComponentStory<typeof GameScriptHistory>;

export const Default: GameScriptHistoryStory = (args) => (
  <GameScriptHistory {...args} />
);

export const ManyTurns: GameScriptHistoryStory = (args) => (
  <GameScriptHistory {...args} turns={Array(100).fill(sampleTurn)} />
);
