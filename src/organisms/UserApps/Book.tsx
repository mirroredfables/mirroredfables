// A windows 95 style chat app for the browser, written in React Native and Typescript.

import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react95-native";
import TextInput from "../../atoms/TextInput";
import ChatHistoryBox from "../../molecules/SystemApps/ChatMessagesBox";

interface BookProps {
  messages: string[];
  sendMessage: (message: string) => void;
  reset: () => void;
}

export default function Book(props: BookProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginBottom: 4,
    },
    headerText: {
      flex: 1,
      margin: 4,
    },
    resetButton: {},
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
  });

  const botIntroText = `Hi, I'm the bible bot. Ask me anything and I will answer you with the bible.

For example: you can ask me "how can the bible help me ask my boss for a raise?"
`;

  const [newMessage, setNewMessage] = React.useState("");

  const handleNewMessageButtonPressed = () => {
    if (newMessage.length > 0) {
      props.sendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{botIntroText}</Text>
        <Button style={styles.resetButton} onPress={props.reset}>
          start over
        </Button>
      </View>
      <ChatHistoryBox messages={props.messages} />
      <View style={styles.newMessageView}>
        <TextInput
          style={styles.newMessageTextInput}
          placeholder={"ask me anything"}
          onChangeText={setNewMessage}
          value={newMessage}
          onSubmitEditing={handleNewMessageButtonPressed}
        />
        <Button
          style={styles.newMessageButton}
          onPress={handleNewMessageButtonPressed}
        >
          ask
        </Button>
      </View>
    </View>
  );
}
