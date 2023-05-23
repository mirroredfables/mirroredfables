// A visual novel game's load game menu, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { Text } from "react95-native";
// import { FontAwesome } from "@expo/vector-icons";
import FontAwesome from "../../atoms/SystemApps/MyFontAwesome";
import { format } from "date-fns";

import GameBackground, {
  GameBackgroundProps,
} from "../../atoms/UserApps/GameBackground";
import GameChoiceButton from "../../atoms/UserApps/GameChoiceButton";
import { GameSaveFile } from "../../redux/VisualNovelGameTurnsSlice";

export interface GameLoadMenuProps {
  background: GameBackgroundProps;
  saves: GameSaveFile[];
  onLoadPressed: (save: GameSaveFile) => void;
  onDeletePressed: (save: GameSaveFile) => void;
  onBackPressed: () => void;
}

export default function GameLoadMenu(props: GameLoadMenuProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 20,
      overflow: "hidden",
    },
    emptyView: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyViewText: {
      color: "white",
      margin: 10,
    },
    choiceButtonsContainer: {
      flex: 1,
    },
    deleteButton: {
      height: 24,
      width: 24,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      right: 16,
      bottom: 16,
    },
    backButtonContainer: {
      height: 72,
    },
    confirmDeleteContainer: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "black",
    },
    confirmDeleteTextContainer: {
      alignItems: "center",
      justifyContent: "center",
      flex: 3,
      margin: 10,
    },
    confirmDeleteText: {
      color: "white",
      margin: 10,
    },
  });

  const [deleteTarget, setDeleteTarget] =
    React.useState<GameSaveFile | null>(null);

  const formateDate = (date: number) => {
    const timestamp = new Date(date);
    const formattedTimestamp = format(timestamp, "yyyy-MM-dd HH:mm:ss");
    return formattedTimestamp;
  };

  const EmptyView = () => {
    if (props.saves.length > 0) {
      return null;
    }
    return (
      <View style={styles.emptyView}>
        <Text style={styles.emptyViewText}>no saves found</Text>
      </View>
    );
  };

  const GameLoadButton = (input: { save: GameSaveFile }) => {
    return (
      <View style={styles.choiceButtonsContainer}>
        <GameChoiceButton
          text={`${formateDate(input.save.timestamp)} \n${
            input.save.previewText
          }`}
          onPress={() => props.onLoadPressed(input.save)}
        />
        <Pressable
          style={styles.deleteButton}
          onPress={() => setDeleteTarget(input.save)}
        >
          <FontAwesome name={"trash"} size={16} color={"white"} />
        </Pressable>
      </View>
    );
  };

  const ConfirmDeleteView = () => {
    if (deleteTarget === null) {
      return null;
    }
    return (
      <View style={styles.confirmDeleteContainer}>
        <View style={styles.container}>
          <View style={styles.confirmDeleteTextContainer}>
            <Text style={styles.confirmDeleteText}>
              {`are you sure you want to delete this save? \n \n${formateDate(
                deleteTarget.timestamp
              )}\n${deleteTarget.previewText}`}
            </Text>
          </View>
          <GameChoiceButton
            text={"delete"}
            onPress={() => {
              props.onDeletePressed(deleteTarget);
              setDeleteTarget(null);
            }}
          />
          <GameChoiceButton
            text={"cancel"}
            onPress={() => setDeleteTarget(null)}
          />
        </View>
      </View>
    );
  };

  return (
    <GameBackground {...props.background}>
      <View style={styles.container}>
        <ScrollView style={styles.choiceButtonsContainer}>
          <EmptyView />
          {props.saves.map((save, index) => (
            <GameLoadButton save={save} key={index} />
          ))}
        </ScrollView>
        <View style={styles.backButtonContainer}>
          <GameChoiceButton text={"back"} onPress={props.onBackPressed} />
        </View>
      </View>
      <ConfirmDeleteView />
    </GameBackground>
  );
}
