import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import WelcomeWizard from "./WelcomeWizard";

const WelcomeWizardMeta: ComponentMeta<typeof WelcomeWizard> = {
  title: "Organisms/SystemApps/WelcomeWizard",
  component: WelcomeWizard,
  argTypes: {},
  args: {
    // onShortStoryButtonPressed: () => console.log("short story button pressed"),
    // onLongStoryButtonPressed: () => console.log("long story button pressed"),
    // onCustomStoryButtonPressed: () =>
    //   console.log("custom story button pressed"),
    buttons: [
      {
        name: "short story",
        onPress: () => console.log("short story button pressed"),
      },
    ],
  },
};

export default WelcomeWizardMeta;

type WelcomeWizardStory = ComponentStory<typeof WelcomeWizard>;

export const Default: WelcomeWizardStory = (args) => (
  <WelcomeWizard {...args} />
);
