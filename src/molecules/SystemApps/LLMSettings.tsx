import * as React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { ScrollView, Fieldset, Button, Text, Divider } from "react95-native";
import * as Linking from "expo-linking";
import TextLink from "../../atoms/SystemApps/TextLink";
import TextInput from "../../atoms/TextInput";
import RadioButton from "../../atoms/SystemApps/RadioButton";
import { GptModel } from "../../redux/ChatgptSlice";

export interface LLMSettingsProps {
  // llmProviders: string[];
  // currentLlmProvider: string;
  openAiKey: string;
  openAiGptModel: GptModel;
  testOpenAiKey: (config: { key: string; model: GptModel }) => void;
  testOpenAiResponse: string;
  configureLLMProvider: (config: { key: string; model: GptModel }) => void;
}

export default function LLMSettings(props: LLMSettingsProps) {
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
    horizontalContainer: {
      flexDirection: "row",
    },
    showSecretButton: {
      marginLeft: 4,
    },
    selectView: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    submitButton: {
      margin: 4,
    },
    testResultText: {
      margin: 8,
    },
    divider: {
      marginVertical: 4,
    },
    applyChangesButton: {
      margin: 8,
    },
  });

  const onOpenAiKeyLinkPress = () => {
    if (Platform.OS === "web") {
      window.open("https://platform.openai.com/account/api-keys");
    } else {
      Linking.openURL("https://platform.openai.com/account/api-keys");
    }
  };

  const [applyChange, setApplyChange] = React.useState(false);
  const [showSecretOpenAiKey, setShowSecretOpenAiKey] = React.useState(false);
  const [openAiKey, setOpenAiKey] = React.useState(props.openAiKey || "");
  const [openAiGptModel, setOpenAiGptModel] = React.useState(
    props.openAiGptModel || GptModel.GPT3
  );
  const [runOpenAiTest, setRunOpenAiTest] = React.useState(false);
  const gptModels = Object.values(GptModel);

  React.useEffect(() => {
    if (applyChange) {
      setApplyChange(false);
      props.configureLLMProvider({
        key: openAiKey,
        model: openAiGptModel,
      });
    }
  }, [applyChange]);

  React.useEffect(() => {
    if (runOpenAiTest) {
      setRunOpenAiTest(false);
      props.configureLLMProvider({
        key: openAiKey,
        model: openAiGptModel,
      });
      props.testOpenAiKey({
        key: openAiKey,
        model: openAiGptModel,
      });
    }
  }, [runOpenAiTest]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        //   alwaysShowScrollbars={true}
      >
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
          <Button
            onPress={() => setRunOpenAiTest(true)}
            style={styles.submitButton}
          >
            test openai api key
          </Button>
          <Text style={styles.testResultText}>{props.testOpenAiResponse}</Text>
        </View>
      </ScrollView>
      <Divider style={styles.divider} />
      <Button
        onPress={() => setApplyChange(true)}
        style={styles.applyChangesButton}
      >
        apply llm changes
      </Button>
    </View>
  );
}
