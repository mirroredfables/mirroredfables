// A visual novel game's credits screen, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, View, ScrollView, Platform } from "react-native";
import * as Linking from "expo-linking";
import { Text } from "react95-native";
import GameBackground, {
  GameBackgroundProps,
} from "../../atoms/UserApps/GameBackground";
import GameChoiceButton from "../../atoms/UserApps/GameChoiceButton";

export interface GameCreditText {
  text: string;
  link?: string;
  style?: {};
}

export interface GameCreditsProps {
  background: GameBackgroundProps;
  onBackPressed: () => void;
  creditTexts: GameCreditText[];
}

export default function GameCredits(props: GameCreditsProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 20,
      overflow: "hidden",
    },
    creditsContainer: {
      flex: 1,
      backgroundColor: "rgba(52, 52, 52, 0.8)",
      margin: 10,
    },
    creditText: {
      margin: 10,
      color: "white",
    },
    backButtonContainer: {
      height: 72,
    },
  });

  const CreditText = (props: GameCreditText) => {
    if (props.link) {
      return (
        <Text
          style={[styles.creditText, props.style]}
          onPress={() => {
            if (Platform.OS === "web") {
              window.open(props.link);
            } else {
              Linking.openURL(props.link);
            }
          }}
        >
          {props.text}
        </Text>
      );
    } else {
      return <Text style={[styles.creditText, props.style]}>{props.text}</Text>;
    }
  };

  return (
    <GameBackground {...props.background}>
      <View style={styles.container}>
        <ScrollView style={styles.creditsContainer}>
          {props.creditTexts.map((creditText, index) => (
            <CreditText key={index} {...creditText} />
          ))}
        </ScrollView>
        <View style={styles.backButtonContainer}>
          <GameChoiceButton text={"back"} onPress={props.onBackPressed} />
        </View>
      </View>
    </GameBackground>
  );
}
