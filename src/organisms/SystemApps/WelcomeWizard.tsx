// A windows 95 style welcome wizard screen for the browser, written in React Native and Typescript.

import * as React from "react";
import { View, StyleSheet } from "react-native";
import { ScrollView, Text, Button, Divider } from "react95-native";

interface WelcomeWizardProps {
  // onShortStoryButtonPressed: () => void;
  // onLongStoryButtonPressed: () => void;
  // onCustomStoryButtonPressed: () => void;

  buttons: {
    name: string;
    onPress: () => void;
  }[];

  welcomeTitle?: string;
  welcomeText?: string;
}

export default function WelcomeWizard(props: WelcomeWizardProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 8,
    },
    welcomeTitle: {
      marginBottom: 8,
      fontSize: 32,
    },
    welcomeTextScrollView: {
      flexShrink: 1,
      flexGrow: 1,
    },
    welcomeText: {
      marginTop: 8,
      marginBottom: 24,
    },
    buttonGroupView: {
      // flexDirection: "row",
      // flexWrap: "wrap",
      justifyContent: "space-between",
      marginVertical: 8,
    },
    button: {
      flexGrow: 1,
    },
  });

  const defaultWelcomeTitle = "mirrored fables";

  const defaultWelcomeText = `Mirrors and copulation are abominable, since they both multiply the numbers of men. - Jorge Luis Borges

welcome to mirrored fables!

embark on a literary odyssey with mirrored fables, an AI-powered visual novel generator that weaves together enchanting narratives and imaginative visuals. delve into the realms of the unknown, discovering untold stories that blur the lines between reality and fiction. unravel complex tales that reflect your innermost thoughts, as each choice you make alters the course of your journey. with mirrored fables, you become both the creator and explorer of a mesmerizing world where every twist and turn is shrouded in mystery, inviting you to step deeper into an ever-evolving narrative labyrinth.

mirrored fables is open source and in very early alpha. please report any bugs or issues to our discord or github. contributions are welcome.

you can request stories in our discord if you don't have openai, but it may take a while for us to get to them. 

enjoy.

ps. if you want some prompt consulting, contact us!
`;

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeTitle}>
        {props.welcomeTitle ?? defaultWelcomeTitle}
      </Text>

      <ScrollView style={styles.welcomeTextScrollView}>
        <Text style={styles.welcomeText}>
          {props.welcomeText ?? defaultWelcomeText}
        </Text>
      </ScrollView>

      <Divider />
      <View style={styles.buttonGroupView}>
        {/* <Button style={styles.button} onPress={props.onShortStoryButtonPressed}>
          short story (5 minutes)
        </Button>
        <Button style={styles.button} onPress={props.onLongStoryButtonPressed}>
          long story (3 hours)
        </Button>
        <Button
          style={styles.button}
          onPress={props.onCustomStoryButtonPressed}
        >
          create your own story
        </Button> */}
        {props.buttons.map((button) => (
          <Button
            key={button.name}
            style={styles.button}
            onPress={button.onPress}
          >
            {button.name}
          </Button>
        ))}
      </View>
    </View>
  );
}
