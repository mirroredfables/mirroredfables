import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import GameTextBox from "./GameTextBox";

export const defaultGameTextBox = {
  text: `Hello, world! \nHello, world! \nHello, world! \nHello, world! \nHello, world!`,
};

const GameTextBoxMeta: ComponentMeta<typeof GameTextBox> = {
  title: "Atoms/UserApps/GameTextBox",
  component: GameTextBox,
  argTypes: {},
  args: defaultGameTextBox,
};

export default GameTextBoxMeta;

type GameTextBoxStory = ComponentStory<typeof GameTextBox>;

export const Default: GameTextBoxStory = (args) => <GameTextBox {...args} />;

export const LongText: GameTextBoxStory = (args) => (
  <GameTextBox
    {...args}
    text={
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vitae ultricies lacinia, nisl nisl aliquet nisl, nec a"
    }
  />
);
