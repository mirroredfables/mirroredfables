import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import YoutubePlayer from "./YoutubePlayer";

const YoutubePlayerMeta: ComponentMeta<typeof YoutubePlayer> = {
  title: "Organisms/SystemApps/YoutubePlayer",
  component: YoutubePlayer,
  argTypes: {},
  args: {
    videoId: "9bZkp7q19f0",
  },
};

export default YoutubePlayerMeta;

type YoutubePlayerStory = ComponentStory<typeof YoutubePlayer>;

export const Default: YoutubePlayerStory = (args) => (
  <YoutubePlayer {...args} />
);
