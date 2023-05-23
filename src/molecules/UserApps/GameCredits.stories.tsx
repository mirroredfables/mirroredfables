import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import GameCredits, { GameCreditsProps } from "./GameCredits";
import { defaultGameBackground } from "../../atoms/UserApps/GameBackground.stories";

const sampleCreditLine0 = { text: "special thanks to:" };

const sampleCreditLine1 = { text: "@myself", link: "https://www.bing.com" };

const sampleCreditLine2 = { text: "---" };

const sampleCreditLine3 = { text: "music" };

const sampleCreditLine4 = {
  text: `Fluffing a Duck by Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 3.0 License
http://creativecommons.org/licenses/by/3.0/
Music promoted by https://www.chosic.com/free-music/all/ 
`,
  link: "http://creativecommons.org/licenses/by/3.0/",
};

export const defaultGameCredits: GameCreditsProps = {
  background: defaultGameBackground,
  onBackPressed: () => {
    console.log("back button pressed");
  },
  creditTexts: [
    sampleCreditLine0,
    sampleCreditLine1,
    sampleCreditLine2,
    sampleCreditLine3,
    sampleCreditLine4,
  ],
};

const GameCreditsMeta: ComponentMeta<typeof GameCredits> = {
  title: "Molecules/UserApps/GameCredits",
  component: GameCredits,
  argTypes: {},
  args: defaultGameCredits,
};

export default GameCreditsMeta;

type GameCreditsStory = ComponentStory<typeof GameCredits>;

export const Default: GameCreditsStory = (args) => <GameCredits {...args} />;

export const LongCredits: GameCreditsStory = (args) => (
  <GameCredits
    {...args}
    creditTexts={[
      sampleCreditLine0,
      sampleCreditLine1,
      sampleCreditLine2,
      sampleCreditLine3,
      sampleCreditLine4,
      sampleCreditLine4,
      sampleCreditLine4,
      sampleCreditLine4,
      sampleCreditLine4,
      sampleCreditLine4,
    ]}
  />
);
