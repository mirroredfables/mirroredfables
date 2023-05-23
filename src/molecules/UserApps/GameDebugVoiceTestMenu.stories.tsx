import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import GameDebugVoiceTestMenu, {
  GameDebugVoiceTestMenuProps,
} from "./GameDebugVoiceTestMenu";
import { defaultGameBackground } from "../../atoms/UserApps/GameBackground.stories";

export const defaultGameDebugVoiceTestMenu: GameDebugVoiceTestMenuProps = {
  background: defaultGameBackground,
  voices: [
    { id: 0, identifier: "voice 1" },
    { id: 1, identifier: "voice 2" },
  ],
  onVoicePressed: (id) => {
    console.log("voice pressed");
  },
  onBackPressed: () => {
    console.log("back button pressed");
  },
};

const GameDebugVoiceTestMenuMeta: ComponentMeta<typeof GameDebugVoiceTestMenu> =
  {
    title: "Molecules/UserApps/GameDebugVoiceTestMenu",
    component: GameDebugVoiceTestMenu,
    argTypes: {},
    args: defaultGameDebugVoiceTestMenu,
  };

export default GameDebugVoiceTestMenuMeta;

type GameDebugVoiceTestMenuStory = ComponentStory<
  typeof GameDebugVoiceTestMenu
>;

export const Default: GameDebugVoiceTestMenuStory = (args) => (
  <GameDebugVoiceTestMenu {...args} />
);
