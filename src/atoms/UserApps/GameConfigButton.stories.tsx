import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import GameConfigButton, { GameConfigButtonProps } from "./GameConfigButton";

export const defaultGameConfigButton: GameConfigButtonProps = {
  onPress: () => {},
};

const GameConfigButtonMeta: ComponentMeta<typeof GameConfigButton> = {
  title: "Atoms/UserApps/GameConfigButton",
  component: GameConfigButton,
  argTypes: {},
  args: defaultGameConfigButton,
};

export default GameConfigButtonMeta;

type GameConfigButtonStory = ComponentStory<typeof GameConfigButton>;

export const Default: GameConfigButtonStory = (args) => (
  <GameConfigButton {...args} />
);

export const BlackColored: GameConfigButtonStory = (args) => (
  <GameConfigButton {...args} color={"black"} />
);
