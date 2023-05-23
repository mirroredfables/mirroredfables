import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import GameStartMenu, { GameStartMenuProps } from "./GameStartMenu";
import { defaultGameBackground } from "../../atoms/UserApps/GameBackground.stories";

export const defaultGameStartMenu: GameStartMenuProps = {
  background: defaultGameBackground,
  onStartPressed: () => {
    console.log("start pressed");
  },
  onLoadPressed: () => {
    console.log("load pressed");
  },
  onImportPressed: () => {
    console.log("import pressed");
  },
  onSettingsPressed: () => {
    console.log("settings pressed");
  },
  onCreditsPressed: () => {
    console.log("credits pressed");
  },
  onExitPressed: () => {
    console.log("exit pressed");
  },
  onResumePressed: () => {
    console.log("resume pressed");
  },
};

const GameStartMenuMeta: ComponentMeta<typeof GameStartMenu> = {
  title: "Molecules/UserApps/GameStartMenu",
  component: GameStartMenu,
  argTypes: {},
  args: defaultGameStartMenu,
};

export default GameStartMenuMeta;

type GameStartMenuStory = ComponentStory<typeof GameStartMenu>;

export const Default: GameStartMenuStory = (args) => (
  <GameStartMenu {...args} />
);

export const WithResume: GameStartMenuStory = (args) => (
  <GameStartMenu {...args} showResumeButton={true} />
);
