import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import GameLoadMenu, { GameLoadMenuProps } from "./GameLoadMenu";
import { defaultGameBackground } from "../../atoms/UserApps/GameBackground.stories";

const sampleSave = {
  id: 0,
  timestamp: 0,
  previewText: "Sample save",
  gameEngineVersion: "0",
  data: {},
};

export const defaultGameLoadMenu: GameLoadMenuProps = {
  background: defaultGameBackground,
  saves: [sampleSave, sampleSave, sampleSave],
  onLoadPressed: (save) => {
    console.log("load button pressed");
  },
  onDeletePressed: (save) => {
    console.log("delete button pressed");
  },
  onBackPressed: () => {
    console.log("back button pressed");
  },
};

const GameLoadMenuMeta: ComponentMeta<typeof GameLoadMenu> = {
  title: "Molecules/UserApps/GameLoadMenu",
  component: GameLoadMenu,
  argTypes: {},
  args: defaultGameLoadMenu,
};

export default GameLoadMenuMeta;

type GameLoadMenuStory = ComponentStory<typeof GameLoadMenu>;

export const Default: GameLoadMenuStory = (args) => <GameLoadMenu {...args} />;

export const ManySaves: GameLoadMenuStory = (args) => (
  <GameLoadMenu {...args} saves={Array(50).fill(sampleSave)} />
);

export const NoSaves: GameLoadMenuStory = (args) => (
  <GameLoadMenu {...args} saves={[]} />
);
