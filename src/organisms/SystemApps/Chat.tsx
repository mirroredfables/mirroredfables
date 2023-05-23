// A windows 95 style chat app for the browser, written in React Native and Typescript.

import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react95-native";
import TextInput from "../../atoms/TextInput";
import ChatHistoryBox from "../../molecules/SystemApps/ChatMessagesBox";

interface ChatProps {
  messages: string[];
  sendMessage: (message: string) => void;
}

export default function Chat(props: ChatProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
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
  });

  const [newMessage, setNewMessage] = React.useState("");

  const handleNewMessageButtonPressed = () => {
    if (newMessage.length > 0) {
      props.sendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <ChatHistoryBox messages={props.messages} />
      <View style={styles.newMessageView}>
        <TextInput
          style={styles.newMessageTextInput}
          placeholder={"hello world"}
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
    </View>
  );
}
