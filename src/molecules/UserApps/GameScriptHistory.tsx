// A visual novel game's script history, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, View, ScrollView } from "react-native";
import { Text } from "react95-native";

import GameBackground, {
  GameBackgroundProps,
} from "../../atoms/UserApps/GameBackground";
import GameChoiceButton from "../../atoms/UserApps/GameChoiceButton";
import { VisualNovelGameTurn } from "../../redux/VisualNovelGameTypes";

export interface GameScriptHistoryProps {
  background: GameBackgroundProps;
  turns: VisualNovelGameTurn[];
  onBackPressed: () => void;
}

export default function GameScriptHistory(props: GameScriptHistoryProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 20,
      overflow: "hidden",
    },
    historyContainer: {
      flex: 1,
      backgroundColor: "rgba(52, 52, 52, 0.8)",
      margin: 10,
    },
    historyText: {
      margin: 10,
      color: "white",
    },
    choiceButtonsContainer: {
      height: 72,
    },
  });

  const scrollViewRef = React.useRef<ScrollView>(null);

  const GameScriptHistoryText = (props: { turn: VisualNovelGameTurn }) => {
    return <Text style={styles.historyText}>{props.turn.text}</Text>;
  };

  return (
    <GameBackground {...props.background}>
      <View style={styles.container}>
        <ScrollView
          style={styles.historyContainer}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: false })
          }
          //   showsVerticalScrollIndicator={false}
        >
          {props.turns.map((turn, index) => (
            <GameScriptHistoryText key={index} turn={turn} />
          ))}
        </ScrollView>

        <View style={styles.choiceButtonsContainer}>
          <GameChoiceButton text={"back"} onPress={props.onBackPressed} />
        </View>
      </View>
    </GameBackground>
  );
}
