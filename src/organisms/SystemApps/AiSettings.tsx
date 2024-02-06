// A windows 95 style gpt settings app for the browser, written in React Native and Typescript.

import * as React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Tabs, Text } from "react95-native";
import { GptModel } from "../../redux/ChatgptSlice";
import { ImageGeneratorProvider } from "../../redux/ImagesSlice";
import LLMSettings from "../../molecules/SystemApps/LLMSettings";
import ImageGeneratorSettings from "../../molecules/SystemApps/ImageGeneratorSettings";
import { VoiceProvider } from "../../redux/ElevenLabsSlice";
import VoiceSettings from "../../molecules/SystemApps/VoiceSettings";

interface AiSettingsProps {
  openAiKey: string;
  openAiGptModel: GptModel;
  voiceProvider: VoiceProvider;
  azureVoiceKey: string;
  elevenKey: string;
  testOpenAiKey: (config: { key: string; model: GptModel }) => void;
  testOpenAiResponse: string;
  testElevenKey: (config: { key: string }) => void;
  testElevenResponse: string;
  imageGenerator: ImageGeneratorProvider;
  stabilityKey: string;
  // configureAi: (config: {
  //   key: string;
  //   model: GptModel;
  //   imageGenerator: ImageGeneratorProvider;
  //   stabilityKey: string;
  //   voiceProvider: VoiceProvider;
  //   elevenKey: string;
  //   azureVoiceKey: string;
  // }) => void;
  configureLLMProvider: (config: { key: string; model: GptModel }) => void;
  configureImageProvider: (config: {
    key: string;
    imageGenerator: string;
    stabilityKey: string;
  }) => void;
  configureVoiceProvider: (config: {
    voiceProvider: string;
    elevenKey: string;
    azureVoiceKey: string;
  }) => void;

  lauchGameMaker: () => void;
}

export default function AiSettings(props: AiSettingsProps) {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    tabContainer: {
      flex: 1,
      padding: 4,
    },
    tabNameView: {},
  });

  const CurrentTab = () => {
    switch (selectedTab) {
      case 0:
        return (
          <LLMSettings
            openAiKey={props.openAiKey}
            openAiGptModel={props.openAiGptModel}
            testOpenAiKey={props.testOpenAiKey}
            testOpenAiResponse={props.testOpenAiResponse}
            configureLLMProvider={props.configureLLMProvider}
          />
        );
      case 1:
        return (
          <ImageGeneratorSettings
            imageGenerator={props.imageGenerator}
            openAiKey={props.openAiKey}
            stabilityKey={props.stabilityKey}
            configureImageProvider={props.configureImageProvider}
          />
        );
      case 2:
        return (
          <VoiceSettings
            voiceProvider={props.voiceProvider}
            elevenKey={props.elevenKey}
            azureVoiceKey={props.azureVoiceKey}
            configureVoiceProvider={props.configureVoiceProvider}
          />
        );
      default:
        return <Text>no settings tab selected</Text>;
    }
  };

  // TODO: Hacky! This is because Tabs.Tab is broken on the web, as it's unclickable
  const TabNameView = (props: { name: string; index: number }) => {
    return (
      <Pressable
        style={styles.tabNameView}
        onPress={() => setSelectedTab(props.index)}
      >
        <Text>{props.name}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Tabs value={selectedTab} onChange={setSelectedTab}>
        <Tabs.Tab value={0}>
          <TabNameView name={"llm"} index={0} />
        </Tabs.Tab>
        <Tabs.Tab value={1}>
          <TabNameView name={"image"} index={1} />
        </Tabs.Tab>
        <Tabs.Tab value={2}>
          <TabNameView name={"voice"} index={2} />
        </Tabs.Tab>
      </Tabs>
      <Tabs.Body style={styles.tabContainer}>
        <CurrentTab />
      </Tabs.Body>
    </View>
  );
}
