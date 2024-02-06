import * as React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { ScrollView, Fieldset, Button, Text, Divider } from "react95-native";
import * as Linking from "expo-linking";
import TextLink from "../../atoms/SystemApps/TextLink";
import TextInput from "../../atoms/TextInput";
import RadioButton from "../../atoms/SystemApps/RadioButton";
import { ImageGeneratorProvider } from "../../redux/ImagesSlice";

export interface ImageGeneratorSettingsProps {
  imageGenerator: ImageGeneratorProvider;
  openAiKey: string;
  stabilityKey: string;
  configureImageProvider: (config: {
    key: string;
    imageGenerator: string;
    stabilityKey: string;
  }) => void;
}

export default function ImageGeneratorSettings(
  props: ImageGeneratorSettingsProps
) {
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

  const onOpenAiKeyLinkPress = () => {
    if (Platform.OS === "web") {
      window.open("https://platform.openai.com/account/api-keys");
    } else {
      Linking.openURL("https://platform.openai.com/account/api-keys");
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
  const [stabilityKey, setStabilityKey] = React.useState(
    props.stabilityKey || ""
  );
  const [showSecretStabilityKey, setShowSecretStabilityKey] =
    React.useState(false);
  const [selectedImageGenerator, setSelectedImageGenerator] = React.useState(
    props.imageGenerator || ImageGeneratorProvider.openai
  );

  const imageGenerators = Object.values(ImageGeneratorProvider);

  React.useEffect(() => {
    if (applyChange) {
      setApplyChange(false);
      props.configureImageProvider({
        key: openAiKey,
        imageGenerator: selectedImageGenerator,
        stabilityKey: stabilityKey,
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
          {selectedImageGenerator == ImageGeneratorProvider.stability ? (
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
            <Fieldset label="openai api key: (set this under llm tab)">
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
                  editable={false}
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
          )}
        </View>
      </ScrollView>
      <Divider style={styles.divider} />
      <Button
        onPress={() => setApplyChange(true)}
        style={styles.applyChangesButton}
      >
        apply image changes
      </Button>
    </View>
  );
}
