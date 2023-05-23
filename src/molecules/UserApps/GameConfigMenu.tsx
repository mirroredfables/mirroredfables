// A visual novel game's config menu, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, View } from "react-native";

import GameBackground, {
  GameBackgroundProps,
} from "../../atoms/UserApps/GameBackground";
import GameChoiceButton from "../../atoms/UserApps/GameChoiceButton";

export interface GameConfigMenuProps {
  background: GameBackgroundProps;
  fullscreen: boolean;
  onFullscreenPressed: () => void;
  autoGengerate: boolean;
  onAutoGeneratePressed: () => void;
  shouldShowAuto: boolean;
  auto: boolean;
  onAutoPressed: () => void;
  onTextBiggerPressed: () => void;
  onTextSmallerPressed: () => void;
  speech: boolean;
  onSpeechPressed: () => void;
  music: boolean;
  onMusicPressed: () => void;
  hideYoutube: boolean;
  onHideYoutubePressed: () => void;
  onHistoryPressed: () => void;
  onExportPressed: () => void;
  onSavePressed: () => void;
  onLoadPressed: () => void;
  onCreditsPressed: () => void;
  onReturnToTitlePressed: () => void;
  onBackPressed: () => void;
  // when starting the game, some buttons are not needed
  showShortMenu?: boolean;
  textSize?: number;
}

export default function GameConfigMenu(props: GameConfigMenuProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 20,
      overflow: "hidden",
    },
    choiceButtonsContainer: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: "space-between",
    },
  });

  // A little hacky, but works for now
  const [justSaved, setJustSaved] = React.useState(false);

  return (
    <GameBackground {...props.background}>
      <View style={styles.container}>
        <View style={styles.choiceButtonsContainer}>
          <GameChoiceButton
            text={props.fullscreen ? "exit fullscreen" : "fullscreen"}
            onPress={props.onFullscreenPressed}
          />
          <GameChoiceButton
            text={
              props.autoGengerate
                ? "turn off auto generate"
                : "turn on auto generate"
            }
            onPress={props.onAutoGeneratePressed}
          />
          {props.shouldShowAuto ? (
            <GameChoiceButton
              text={props.auto ? "turn off auto play" : "turn on auto play"}
              onPress={props.onAutoPressed}
            />
          ) : (
            <GameChoiceButton
              text="auto play disabled on ios web"
              onPress={() => {}}
              disabled={true}
            />
          )}
          {/* <GameChoiceButton
            text={"auto speed: 1x"}
            onPress={() => {}}
            disabled={true}
          /> */}
          <GameChoiceButton
            text={"make text bigger"}
            onPress={props.onTextBiggerPressed}
            textStyle={props.textSize ? { fontSize: props.textSize } : {}}
          />
          <GameChoiceButton
            text={"make text smaller"}
            onPress={props.onTextSmallerPressed}
            textStyle={props.textSize ? { fontSize: props.textSize } : {}}
          />
          <GameChoiceButton
            text={props.speech ? "turn off voice" : "turn on voice"}
            onPress={props.onSpeechPressed}
          />
          <GameChoiceButton
            text={props.music ? "turn off music" : "turn on music"}
            onPress={props.onMusicPressed}
          />
          <GameChoiceButton
            text={
              props.hideYoutube
                ? "show youtube music video"
                : "hide youtube music video"
            }
            onPress={props.onHideYoutubePressed}
          />
          {props.showShortMenu ? null : (
            <>
              <GameChoiceButton
                text={"history"}
                onPress={props.onHistoryPressed}
              />
              <GameChoiceButton
                text={"export"}
                onPress={props.onExportPressed}
              />
              <GameChoiceButton
                text={justSaved ? "saved!" : "save"}
                onPress={() => {
                  props.onSavePressed();
                  setJustSaved(true);
                }}
              />
              <GameChoiceButton text={"load"} onPress={props.onLoadPressed} />
              <GameChoiceButton
                text={"credits"}
                onPress={props.onCreditsPressed}
              />
              <GameChoiceButton
                text={"return to title"}
                onPress={props.onReturnToTitlePressed}
              />
            </>
          )}
          <GameChoiceButton text={"back"} onPress={props.onBackPressed} />
        </View>
      </View>
    </GameBackground>
  );
}
