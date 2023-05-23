import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import GameConfigMenu, { GameConfigMenuProps } from "./GameConfigMenu";
import { defaultGameBackground } from "../../atoms/UserApps/GameBackground.stories";

export const defaultGameConfigMenu: GameConfigMenuProps = {
  background: defaultGameBackground,
  fullscreen: false,
  onFullscreenPressed: () => {
    console.log("fullscreen changed");
  },
  autoGengerate: false,
  onAutoGeneratePressed: () => {
    console.log("auto generate changed");
  },
  shouldShowAuto: true,
  auto: false,
  onAutoPressed: () => {
    console.log("auto changed");
  },
  onTextBiggerPressed: () => {
    console.log("text bigger pressed");
  },
  onTextSmallerPressed: () => {
    console.log("text smaller pressed");
  },
  speech: false,
  onSpeechPressed: () => {
    console.log("speech changed");
  },
  music: false,
  onMusicPressed: () => {
    console.log("music changed");
  },
  hideYoutube: false,
  onHideYoutubePressed: () => {
    console.log("hide youtube changed");
  },
  onHistoryPressed: () => {
    console.log("history pressed");
  },
  onExportPressed: () => {
    console.log("export pressed");
  },
  onSavePressed: () => {
    console.log("save pressed");
  },
  onLoadPressed: () => {
    console.log("load pressed");
  },
  onCreditsPressed: () => {
    console.log("credits pressed");
  },
  onBackPressed: () => {
    console.log("back button pressed");
  },
  onReturnToTitlePressed: () => {
    console.log("return to title pressed");
  },
};

const GameConfigMenuMeta: ComponentMeta<typeof GameConfigMenu> = {
  title: "Molecules/UserApps/GameConfigMenu",
  component: GameConfigMenu,
  argTypes: {},
  args: defaultGameConfigMenu,
};

export default GameConfigMenuMeta;

type GameConfigMenuStory = ComponentStory<typeof GameConfigMenu>;

export const Default: GameConfigMenuStory = (args) => (
  <GameConfigMenu {...args} />
);

export const TitleMenu: GameConfigMenuStory = (args) => (
  <GameConfigMenu {...args} showShortMenu={true} />
);
