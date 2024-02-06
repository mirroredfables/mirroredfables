import * as React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { ScrollView, Fieldset, Button, Text, Divider } from "react95-native";
import * as Linking from "expo-linking";
import TextLink from "../../atoms/SystemApps/TextLink";
import TextInput from "../../atoms/TextInput";
import RadioButton from "../../atoms/SystemApps/RadioButton";
import { VoiceProvider } from "../../redux/ElevenLabsSlice";

export interface VoiceSettingsProps {
  voiceProvider: VoiceProvider;
  elevenKey: string;
  azureVoiceKey: string;
  configureVoiceProvider: (config: {
    voiceProvider: string;
    elevenKey: string;
    azureVoiceKey: string;
  }) => void;
}

export default function VoiceSettings(props: VoiceSettingsProps) {
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
    divider: {
      marginVertical: 4,
    },
    applyChangesButton: {
      margin: 8,
    },
  });

  const onElevenKeyLinkPress = () => {
    if (Platform.OS === "web") {
      window.open("https://beta.elevenlabs.io/speech-synthesis");
    } else {
      Linking.openURL("https://beta.elevenlabs.io/speech-synthesis");
    }
  };

  const onAzureKeyLinkPress = () => {
    if (Platform.OS === "web") {
      window.open(
        "https://azure.microsoft.com/en-us/products/ai-services/ai-speech"
      );
    } else {
      Linking.openURL(
        "https://azure.microsoft.com/en-us/products/ai-services/ai-speech"
      );
    }
  };

  const [applyChange, setApplyChange] = React.useState(false);
  const [elevenKey, setElevenKey] = React.useState(props.elevenKey || "");
  const [showSecretElevenKey, setShowSecretElevenKey] = React.useState(false);
  const [azureVoiceKey, setAzureKey] = React.useState(
    props.azureVoiceKey || ""
  );
  const [showSecretAzureKey, setShowSecretAzureKey] = React.useState(false);
  const [selectedVoiceProvider, setSelectedVoiceProvider] = React.useState(
    props.voiceProvider || VoiceProvider.eleven
  );

  const voiceProviders = Object.values(VoiceProvider);

  React.useEffect(() => {
    if (applyChange) {
      setApplyChange(false);
      props.configureVoiceProvider({
        voiceProvider: selectedVoiceProvider,
        elevenKey: elevenKey,
        azureVoiceKey: azureVoiceKey,
      });
    }
  }, [applyChange]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        //   alwaysShowScrollbars={true}
      >
        <View style={styles.insideContainer}>
          <Fieldset label="voice provider:">
            <View style={styles.selectView}>
              {voiceProviders.map((option) => (
                <RadioButton
                  label={option}
                  key={option}
                  setter={setSelectedVoiceProvider}
                  getter={selectedVoiceProvider}
                />
              ))}
            </View>
          </Fieldset>
          {selectedVoiceProvider == VoiceProvider.eleven ? (
            <Fieldset label="elevenlabs api key:">
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
          ) : (
            <Fieldset label="azure voice api key:">
              <TextLink
                containerStyle={styles.openAiLinkContainer}
                onPress={onAzureKeyLinkPress}
                text={"get it from azure"}
              />
              <View style={styles.horizontalContainer}>
                <TextInput
                  secureTextEntry={!showSecretAzureKey}
                  autoCapitalize={"none"}
                  placeholder={"..."}
                  value={azureVoiceKey}
                  onChangeText={(newValue) => {
                    setAzureKey(newValue);
                  }}
                />
                <Button
                  style={styles.showSecretButton}
                  onPress={() => {
                    setShowSecretAzureKey(!showSecretAzureKey);
                  }}
                  active={showSecretAzureKey}
                >
                  👀
                </Button>
              </View>
            </Fieldset>
          )}
        </View>
      </ScrollView>
      <Divider style={styles.divider} />
      <Button
        onPress={() => setApplyChange(true)}
        style={styles.applyChangesButton}
      >
        apply voice changes
      </Button>
    </View>
  );
}
