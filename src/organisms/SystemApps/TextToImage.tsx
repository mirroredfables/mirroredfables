// A windows 95 style text to image app for the browser, written in React Native and Typescript.

import * as React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Button } from "react95-native";
import TextInput from "../../atoms/TextInput";
import { GenerateImageForm } from "../../redux/ImagesSlice";

interface TextToImageProps {
  generateImage: (input: GenerateImageForm) => void;
  generatedImage: string;
}

export default function TextToImage(props: TextToImageProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      flex: 1,
    },
    newPromptView: {
      flexDirection: "row",
      alignItems: "flex-end",
      margin: 0,
      marginTop: 4,
    },
    promptTextInput: {
      flex: 1,
    },
    submitButton: {
      marginLeft: 4,
    },
  });

  const [newPrompt, setNewPrompt] = React.useState("");

  const handleSubmitPrompt = () => {
    if (newPrompt.length > 0) {
      props.generateImage({
        prompt: newPrompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      });
      setNewPrompt("");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: props.generatedImage }} style={styles.image} />
      <View style={styles.newPromptView}>
        <TextInput
          style={styles.promptTextInput}
          placeholder={"hello world"}
          onChangeText={setNewPrompt}
          value={newPrompt}
          onSubmitEditing={handleSubmitPrompt}
        />
        <Button style={styles.submitButton} onPress={handleSubmitPrompt}>
          send
        </Button>
      </View>
    </View>
  );
}
