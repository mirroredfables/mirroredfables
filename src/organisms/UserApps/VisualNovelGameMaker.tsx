// A visual novel game maker, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet, View } from "react-native";
import { Button } from "react95-native";
import * as Clipboard from "expo-clipboard";
import TextInput from "../../atoms/TextInput";
import ChatHistoryBox from "../../molecules/SystemApps/ChatMessagesBox";
// import { VisualNovelGameMakerGameState } from "../../redux/VisualNovelGameMakerSlice";
import { GameSliceState } from "../../redux/GameSlice";
import GameDebugMenu, {
  GameDebugMenuProps,
} from "../../molecules/UserApps/GameDebugMenu";

export interface VisualNovelGameMakerProps {
  messages: string[];
  sendMessage: (message: string) => void;
  makeGameState: GameSliceState;
  saveChangedMakeGameState: (makeGameState: GameSliceState) => void;
  startGame: () => void;
  readyToStartGame: boolean;
  debug?: boolean;
  debugMenu?: GameDebugMenuProps;
}

export default function VisualNovelGameMaker(props: VisualNovelGameMakerProps) {
  const [showEditor, setShowEditor] = React.useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    rowContainer: {
      flexDirection: "row",
      flex: 1,
    },
    debugContainer: {
      display: props.debug ? "flex" : "none",
      flex: 1,
    },
    editorContainer: {
      display: showEditor ? "flex" : "none",
      flex: 1,
      marginLeft: 8,
    },
    showEditorButton: {
      marginBottom: 4,
    },
    newMessageView: {
      flexDirection: "row",
      alignItems: "flex-end",
      margin: 0,
      marginTop: 4,
    },
    newMessageTextInput: {
      flex: 1,
    },
    newMessageButton: {
      marginLeft: 4,
    },
    startGameButton: {
      marginTop: 4,
    },
    makeGameStateTextInput: {
      flex: 1,
    },
  });

  const [newMessage, setNewMessage] = React.useState("");

  const handleNewMessageButtonPressed = () => {
    if (newMessage.length > 0) {
      // the first message is going to initialize the world
      props.sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleStartGameButtonPressed = () => {
    props.startGame();
  };

  const handleExportButtonPressed = () => {
    Clipboard.setStringAsync(JSON.stringify(props.makeGameState));
  };

  const handleSaveChangesButtonPressed = () => {
    props.saveChangedMakeGameState(JSON.parse(customizedMakeGameState));
  };

  const [customizedMakeGameState, setCustomizedMakeGameState] = React.useState(
    // this prettifys the JSON
    JSON.stringify(props.makeGameState, null, 1)
  );

  React.useEffect(() => {
    setCustomizedMakeGameState(JSON.stringify(props.makeGameState, null, 1));
  }, [props.makeGameState]);

  return (
    <View style={styles.rowContainer}>
      <View style={styles.container}>
        <Button
          style={styles.showEditorButton}
          onPress={() => {
            setShowEditor(!showEditor);
          }}
        >
          show editor
        </Button>
        <ChatHistoryBox messages={props.messages} />
        <View style={styles.newMessageView}>
          <TextInput
            style={styles.newMessageTextInput}
            placeholder={"type here"}
            onChangeText={setNewMessage}
            value={newMessage}
            onSubmitEditing={handleNewMessageButtonPressed}
          />
          <Button
            style={styles.newMessageButton}
            onPress={handleNewMessageButtonPressed}
          >
            send
          </Button>
        </View>
        <Button
          style={styles.startGameButton}
          onPress={handleStartGameButtonPressed}
          disabled={!props.readyToStartGame}
        >
          {props.readyToStartGame ? "start game" : "not ready to start game"}
        </Button>
      </View>
      <View style={styles.editorContainer}>
        <Button
          style={styles.showEditorButton}
          onPress={handleExportButtonPressed}
        >
          export game state
        </Button>
        <Button
          style={styles.showEditorButton}
          onPress={handleSaveChangesButtonPressed}
        >
          save changes
        </Button>
        <TextInput
          style={styles.makeGameStateTextInput}
          multiline={true}
          placeholder={"game state here"}
          onChangeText={setCustomizedMakeGameState}
          value={customizedMakeGameState}
          onSubmitEditing={handleSaveChangesButtonPressed}
        />
        {props.debug ? <GameDebugMenu {...props.debugMenu} /> : null}
      </View>
    </View>
  );
}
