import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import GameStartButton, { GameStartButtonProps } from "./GameStartButton";

export const defaultGameStartButton: GameStartButtonProps = {
  text: "start",
  onPress: () => {},
};

const GameStartButtonMeta: ComponentMeta<typeof GameStartButton> = {
  title: "Atoms/UserApps/GameStartButton",
  component: GameStartButton,
  argTypes: {},
  args: defaultGameStartButton,
};

export default GameStartButtonMeta;

type GameStartButtonStory = ComponentStory<typeof GameStartButton>;

export const Default: GameStartButtonStory = (args) => (
  <GameStartButton {...args} />
);
