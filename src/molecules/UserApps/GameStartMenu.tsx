// A visual novel game's start menu, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, View } from "react-native";
import GameBackground, {
  GameBackgroundProps,
} from "../../atoms/UserApps/GameBackground";
import GameStartButton from "../../atoms/UserApps/GameStartButton";

export interface GameStartMenuProps {
  background: GameBackgroundProps;
  onStartPressed: () => void;
  onLoadPressed: () => void;
  onImportPressed: () => void;
  onSettingsPressed: () => void;
  onCreditsPressed: () => void;
  onExitPressed: () => void;
  onResumePressed: () => void;
  showResumeButton?: boolean;
}

export default function GameStartMenu(props: GameStartMenuProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 20,
      overflow: "hidden",
    },
    innerContainer: {
      position: "absolute",
      right: 0,
      bottom: 0,
    },
  });

  return (
    <GameBackground {...props.background}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          {props.showResumeButton ? (
            <GameStartButton text={"resume"} onPress={props.onResumePressed} />
          ) : null}
          <GameStartButton text={"start"} onPress={props.onStartPressed} />
          <GameStartButton text={"load"} onPress={props.onLoadPressed} />
          <GameStartButton text={"import"} onPress={props.onImportPressed} />
          {/* <GameStartButton
            text={"settings"}
            onPress={props.onSettingsPressed}
          /> */}
          <GameStartButton text={"credits"} onPress={props.onCreditsPressed} />
          <GameStartButton text={"exit"} onPress={props.onExitPressed} />
        </View>
      </View>
    </GameBackground>
  );
}
