import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import GameYoutubePlayer from "./GameYoutubePlayer";

const GameYoutubePlayerMeta: ComponentMeta<typeof GameYoutubePlayer> = {
  title: "Molecules/UserApps/GameYoutubePlayer",
  component: GameYoutubePlayer,
  argTypes: {},
  args: {
    videoId: "9bZkp7q19f0",
  },
};

export default GameYoutubePlayerMeta;

type GameYoutubePlayerStory = ComponentStory<typeof GameYoutubePlayer>;

export const Default: GameYoutubePlayerStory = (args) => (
  <GameYoutubePlayer {...args} />
);

export const Hidden: GameYoutubePlayerStory = (args) => (
  <GameYoutubePlayer {...args} />
);
