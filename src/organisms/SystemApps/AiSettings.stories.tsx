import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import AiSettings from "./AiSettings";
import { GptModel } from "../../redux/ChatgptSlice";

const AiSettingsMeta: ComponentMeta<typeof AiSettings> = {
  title: "Molecules/SystemApps/AiSettings",
  component: AiSettings,
  argTypes: {},
  args: {
    openAiKey: "",
    openAiGptModel: GptModel.GPT3,
    configureAi: (model) => {
      console.log("openAiGptModel changed to: " + model);
    },
    testOpenAiKey: (config) => {
      console.log("testOpenAiKey called with config: " + config);
      return "test result is here";
    },
  },
};

export default AiSettingsMeta;

type AiSettingsStory = ComponentStory<typeof AiSettings>;

export const Default: AiSettingsStory = (args) => <AiSettings {...args} />;
