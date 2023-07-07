// A windows 95 style gpt settings app for the browser, written in React Native and Typescript.

import * as React from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  ScrollView,
  Text,
  Fieldset,
  Radio,
  Button,
  Divider,
} from "react95-native";
import * as Linking from "expo-linking";
import TextInput from "../../atoms/TextInput";
import { GptModel } from "../../redux/ChatgptSlice";
import TextLink from "../../atoms/SystemApps/TextLink";

interface AiSettingsProps {
  openAiKey: string;
  openAiGptModel: GptModel;
  elevenKey: string;
  testOpenAiKey: (config: { key: string; model: GptModel }) => void;
  testOpenAiResponse: string;
  testElevenKey: (config: { key: string }) => void;
  testElevenResponse: string;
  imageGenerator: string;
  stabilityKey: string;
  configureAi: (config: {
    key: string;
    model: GptModel;
    elevenKey: string;
    imageGenerator: string;
    stabilityKey: string;
  }) => void;
  lauchGameMaker: () => void;
}

export default function AiSettings(props: AiSettingsProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    insideContainer: {
      margin: 4,
    },
    openAiLinkContainer: {
      marginBottom: 8,
    },
    selectView: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    radioButton: {},
    submitButton: {
      margin: 4,
    },
    testResultText: {
      margin: 8,
    },
    divider: {
      marginVertical: 8,
    },
    horizontalContainer: {
      flexDirection: "row",
    },
    showSecretButton: {
      marginLeft: 4,
    },
    applyChangesButton: {
      margin: 4,
    },
  });

  const onOpenAiKeyLinkPress = () => {
    if (Platform.OS === "web") {
      window.open("https://platform.openai.com/account/api-keys");
    } else {
      Linking.openURL("https://platform.openai.com/account/api-keys");
    }
  };

  const onElevenKeyLinkPress = () => {
    if (Platform.OS === "web") {
      window.open("https://beta.elevenlabs.io/speech-synthesis");
    } else {
      Linking.openURL("https://beta.elevenlabs.io/speech-synthesis");
    }
  };

  const onStabilityKeyLinkPress = () => {
    if (Platform.OS === "web") {
      window.open("https://www.stability.ai/");
    } else {
      Linking.openURL("https://www.stability.ai/");
    }
  };

  const [applyChange, setApplyChange] = React.useState(false);
  const [showSecretOpenAiKey, setShowSecretOpenAiKey] = React.useState(false);
  const [openAiKey, setOpenAiKey] = React.useState(props.openAiKey || "");
  const [openAiGptModel, setOpenAiGptModel] = React.useState(
    props.openAiGptModel || GptModel.GPT3
  );
  const [runOpenAiTest, setRunOpenAiTest] = React.useState(false);
  const [elevenKey, setElevenKey] = React.useState(props.elevenKey || "");
  const [showSecretElevenKey, setShowSecretElevenKey] = React.useState(false);
  const [runElevenTest, setRunElevenTest] = React.useState(false);
  const [stabilityKey, setStabilityKey] = React.useState(
    props.stabilityKey || ""
  );
  const [showSecretStabilityKey, setShowSecretStabilityKey] =
    React.useState(false);

  const imageGenerators = ["openai dall-e", "stability stable diffusion"];
  const [selectedImageGenerator, setSelectedImageGenerator] = React.useState(
    props.imageGenerator || "stability stable diffusion"
  );

  const gptModels = Object.values(GptModel);

  const RadioButton = (props: {
    label: string;
    setter: (string) => void;
    getter: string;
  }) => {
    return (
      <Radio
        status={props.getter === props.label ? "checked" : "unchecked"}
        onPress={() => {
          props.setter(props.label);
        }}
        label={props.label}
        style={styles.radioButton}
      />
    );
  };

  React.useEffect(() => {
    if (applyChange) {
      setApplyChange(false);
      props.configureAi({
        key: openAiKey,
        model: openAiGptModel,
        elevenKey: elevenKey,
        imageGenerator: selectedImageGenerator,
        stabilityKey: stabilityKey,
      });
    }
  }, [applyChange]);

  React.useEffect(() => {
    if (runOpenAiTest) {
      setRunOpenAiTest(false);
      props.testOpenAiKey({
        key: openAiKey,
        model: openAiGptModel,
      });
    }
  }, [runOpenAiTest]);

  React.useEffect(() => {
    if (runElevenTest) {
      setRunElevenTest(false);
      props.testElevenKey({
        key: elevenKey,
      });
    }
  }, [runElevenTest]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.insideContainer}>
        <Fieldset label="openai api key (this is stored locally):">
          <TextLink
            containerStyle={styles.openAiLinkContainer}
            onPress={onOpenAiKeyLinkPress}
            text={"get it from openai"}
          />
          <View style={styles.horizontalContainer}>
            <TextInput
              secureTextEntry={!showSecretOpenAiKey}
              autoCapitalize={"none"}
              placeholder={"sk-..."}
              value={openAiKey}
              onChangeText={(newValue) => {
                setOpenAiKey(newValue);
              }}
            />
            <Button
              style={styles.showSecretButton}
              onPress={() => {
                setShowSecretOpenAiKey(!showSecretOpenAiKey);
              }}
              active={showSecretOpenAiKey}
            >
              👀
            </Button>
          </View>
        </Fieldset>
        <Fieldset label="openai gpt model (gpt-4 recommanded):">
          <View style={styles.selectView}>
            {gptModels.map((option) => (
              <RadioButton
                label={option}
                key={option}
                setter={setOpenAiGptModel}
                getter={openAiGptModel}
              />
            ))}
          </View>
        </Fieldset>
      </View>
      <Button
        onPress={() => setRunOpenAiTest(true)}
        style={styles.submitButton}
      >
        test openai api key
      </Button>
      <Text style={styles.testResultText}>{props.testOpenAiResponse}</Text>
      <Divider style={styles.divider} />
      <View style={styles.insideContainer}>
        <Fieldset label="elevenlabs api key (optional, for voices):">
          <TextLink
            containerStyle={styles.openAiLinkContainer}
            onPress={onElevenKeyLinkPress}
            text={"get it from elevenlabs"}
          />
          <View style={styles.horizontalContainer}>
            <TextInput
              secureTextEntry={!showSecretElevenKey}
              autoCapitalize={"none"}
              placeholder={"..."}
              value={elevenKey}
              onChangeText={(newValue) => {
                setElevenKey(newValue);
              }}
            />
            <Button
              style={styles.showSecretButton}
              onPress={() => {
                setShowSecretElevenKey(!showSecretElevenKey);
              }}
              active={showSecretElevenKey}
            >
              👀
            </Button>
          </View>
        </Fieldset>
      </View>
      <Button
        onPress={() => setRunElevenTest(true)}
        style={styles.submitButton}
        // disabled={true}
      >
        test elevenlabs api key
      </Button>
      <Text style={styles.testResultText}>{props.testElevenResponse}</Text>
      <Divider style={styles.divider} />
      <View style={styles.insideContainer}>
        <Fieldset label="image generator:">
          <View style={styles.selectView}>
            {imageGenerators.map((option) => (
              <RadioButton
                label={option}
                key={option}
                setter={setSelectedImageGenerator}
                getter={selectedImageGenerator}
              />
            ))}
          </View>
        </Fieldset>
        {selectedImageGenerator == "stability stable diffusion" ? (
          <Fieldset label="stablility api key:">
            <TextLink
              containerStyle={styles.openAiLinkContainer}
              onPress={onStabilityKeyLinkPress}
              text={"get it from stability.ai"}
            />
            <View style={styles.horizontalContainer}>
              <TextInput
                secureTextEntry={!showSecretStabilityKey}
                autoCapitalize={"none"}
                placeholder={"sk-..."}
                value={stabilityKey}
                onChangeText={(newValue) => {
                  setStabilityKey(newValue);
                }}
              />
              <Button
                style={styles.showSecretButton}
                onPress={() => {
                  setShowSecretStabilityKey(!showSecretStabilityKey);
                }}
                active={showSecretStabilityKey}
              >
                👀
              </Button>
            </View>
          </Fieldset>
        ) : (
          <></>
        )}
      </View>

      <Divider style={styles.divider} />
      <Button
        onPress={() => setApplyChange(true)}
        style={styles.applyChangesButton}
      >
        apply changes
      </Button>
      <Button onPress={props.lauchGameMaker} style={styles.applyChangesButton}>
        launch game maker
      </Button>
    </ScrollView>
  );
}
