import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import VisualNovelGame, { VisualNovelGameProps } from "./VisualNovelGame";
import { defaultGameBackground } from "../../atoms/UserApps/GameBackground.stories";
import { defaultGamePortrait } from "../../atoms/UserApps/GamePortrait.stories";
import { defaultGameTextBox } from "../../atoms/UserApps/GameTextBox.stories";
import { defaultGameChoiceButton } from "../../atoms/UserApps/GameChoiceButton.stories";
import { defaultGameDebugMenu } from "../../molecules/UserApps/GameDebugMenu.stories";

export const defaultVisualNovelGame: VisualNovelGameProps = {
  background: defaultGameBackground,
  portraits: [defaultGamePortrait, { ...defaultGamePortrait, active: false }],
  textBox: defaultGameTextBox,
  choiceButtons: [],
  configButton: {
    onPress: () => {
      console.log("config button pressed");
    },
  },
  onContinue: () => {
    console.log("continue button pressed");
  },
  debug: false,
  debugMenu: defaultGameDebugMenu,
};

const VisualNovelGameMeta: ComponentMeta<typeof VisualNovelGame> = {
  title: "Organisms/UserApps/VisualNovelGame",
  component: VisualNovelGame,
  argTypes: {},
  args: defaultVisualNovelGame,
};

export default VisualNovelGameMeta;

type VisualNovelGameStory = ComponentStory<typeof VisualNovelGame>;

export const Default: VisualNovelGameStory = (args) => (
  <VisualNovelGame {...args} />
);

export const RightSideActive: VisualNovelGameStory = (args) => (
  <VisualNovelGame
    {...args}
    portraits={[{ ...defaultGamePortrait, active: false }, defaultGamePortrait]}
  />
);

export const ThreePortraits: VisualNovelGameStory = (args) => (
  <VisualNovelGame
    {...args}
    portraits={[
      { ...defaultGamePortrait, active: false },
      defaultGamePortrait,
      { ...defaultGamePortrait, active: false },
    ]}
  />
);

export const WithChoiceButtons: VisualNovelGameStory = (args) => (
  <VisualNovelGame
    {...args}
    choiceButtons={[
      defaultGameChoiceButton,
      defaultGameChoiceButton,
      defaultGameChoiceButton,
    ]}
  />
);

export const WithDebugMenu: VisualNovelGameStory = (args) => (
  <VisualNovelGame {...args} debug={true} />
);
