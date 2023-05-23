// A visual novel game's debug voice test menu, written in React Native and Typescript.

import * as React from "react";

import { ScrollView, StyleSheet, View } from "react-native";

import GameBackground, {
  GameBackgroundProps,
} from "../../atoms/UserApps/GameBackground";
import GameChoiceButton from "../../atoms/UserApps/GameChoiceButton";

export interface GameDebugVoiceTestMenuProps {
  background: GameBackgroundProps;
  onBackPressed: () => void;
  voices: { identifier: string }[];
  onVoicePressed: (id: number) => void;
}

export default function GameDebugVoiceTestMenu(
  props: GameDebugVoiceTestMenuProps
) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 20,
      overflow: "hidden",
    },
  });

  return (
    <GameBackground {...props.background}>
      <ScrollView style={styles.container}>
        <GameChoiceButton text="back" onPress={props.onBackPressed} />
        {props.voices.map((voice, index) => (
          <GameChoiceButton
            key={index}
            text={voice.identifier}
            onPress={() => props.onVoicePressed(index)}
          />
        ))}
      </ScrollView>
    </GameBackground>
  );
}
