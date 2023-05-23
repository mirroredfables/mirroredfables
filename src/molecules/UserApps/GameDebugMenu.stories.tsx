import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import GameDebugMenu, { GameDebugMenuProps } from "./GameDebugMenu";

export const defaultGameDebugMenu: GameDebugMenuProps = {
  text: "debug status",
  buttons: [
    {
      name: "Debug Button 1",
      onPress: () => {
        console.log("Button 1 pressed");
      },
    },
    {
      name: "Debug Button 2",
      onPress: () => {
        console.log("Button 2 pressed");
      },
    },
  ],
};

const GameDebugMenuMeta: ComponentMeta<typeof GameDebugMenu> = {
  title: "Molecules/UserApps/GameDebugMenu",
  component: GameDebugMenu,
  argTypes: {},
  args: defaultGameDebugMenu,
};

export default GameDebugMenuMeta;

type GameDebugMenuStory = ComponentStory<typeof GameDebugMenu>;

export const Default: GameDebugMenuStory = (args) => (
  <GameDebugMenu {...args} />
);
