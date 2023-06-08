// A visual novel game, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, View, Pressable } from "react-native";

import GameBackground, {
  GameBackgroundProps,
} from "../../atoms/UserApps/GameBackground";
import GamePortrait, {
  GamePortraitProps,
} from "../../atoms/UserApps/GamePortrait";
import GameTextBox, {
  GameTextBoxProps,
} from "../../atoms/UserApps/GameTextBox";
import GameConfigButton, {
  GameConfigButtonProps,
} from "../../atoms/UserApps/GameConfigButton";
import GameChoiceButton, {
  GameChoiceButtonProps,
} from "../../atoms/UserApps/GameChoiceButton";
import GameDebugMenu, {
  GameDebugMenuProps,
} from "../../molecules/UserApps/GameDebugMenu";

export interface VisualNovelGameProps {
  background: GameBackgroundProps;
  portraits: GamePortraitProps[];
  activePortraitName?: string;
  textBox: GameTextBoxProps;
  choiceButtons: GameChoiceButtonProps[];
  onEdit: () => void;
  onConfig: () => void;
  onContinue: () => void;
  debug?: boolean;
  debugMenu?: GameDebugMenuProps;
}

export default function VisualNovelGame(props: VisualNovelGameProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 20,
      overflow: "hidden",
    },
    portraitContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    textBoxContainer: {
      marginTop: 20,
      // height: 108, // TODO: should be a multiple of text size
      minHeight: 108,
    },
    configButtonContainer: {
      position: "absolute",
      flex: 1,
      flexDirection: "row",
      right: 6,
      bottom: 6,
    },
    choiceButtonsContainer: {
      display: props.choiceButtons.length > 0 ? "flex" : "none",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: "space-between",
    },
  });

  return (
    <GameBackground {...props.background}>
      <Pressable style={styles.container} onPress={props.onContinue}>
        <View style={styles.portraitContainer}>
          {props.portraits.map((portrait, index) => (
            <GamePortrait
              {...portrait}
              active={props.activePortraitName === portrait.name}
              key={index}
            />
          ))}
        </View>
        <View style={styles.textBoxContainer}>
          <GameTextBox {...props.textBox} />
          <View style={styles.configButtonContainer}>
            {/* <GameConfigButton onPress={props.onEdit} icon={"edit"} /> */}
            <GameConfigButton onPress={props.onConfig} />
          </View>
        </View>
        <View style={styles.choiceButtonsContainer}>
          {props.choiceButtons.map((choiceButton) => (
            <GameChoiceButton {...choiceButton} />
          ))}
        </View>
      </Pressable>
      {props.debug ? <GameDebugMenu {...props.debugMenu} /> : null}
    </GameBackground>
  );
}
