import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import GameChoiceButton from "./GameChoiceButton";

export const defaultGameChoiceButton = {
  text: "making a choice here",
  onPress: () => console.log("pressed"),
};

const GameChoiceButtonMeta: ComponentMeta<typeof GameChoiceButton> = {
  title: "Atoms/UserApps/GameChoiceButton",
  component: GameChoiceButton,
  argTypes: {},
  args: defaultGameChoiceButton,
};

export default GameChoiceButtonMeta;

type GameChoiceButtonStory = ComponentStory<typeof GameChoiceButton>;

export const Default: GameChoiceButtonStory = (args) => (
  <GameChoiceButton {...args} />
);

export const LongText: GameChoiceButtonStory = (args) => (
  <GameChoiceButton
    {...args}
    text={
      "This is a very long text that will probably overflow the button. This is a very long text that will probably overflow the button. This is a very long text that will probably overflow the button. This is a very long text that will probably overflow the button."
    }
  />
);
