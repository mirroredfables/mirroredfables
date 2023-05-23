// A windows 95 style chat history box for the browser, written in React Native and Typescript.

import * as React from "react";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import { Panel, Text } from "react95-native";

interface ChatHistoryBoxProps {
  messages: string[];
}

export default function ChatHistoryBox(props: ChatHistoryBoxProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    messageText: {
      margin: 4,
    },
  });

  const flatListViewRef = React.useRef<FlatList>(null);

  const renderChatMessageAsCard = (
    info: ListRenderItemInfo<string>
  ): React.ReactElement => <Text style={styles.messageText}>{info.item}</Text>;

  return (
    <Panel variant="cutout" style={styles.container}>
      <FlatList
        ref={flatListViewRef}
        onContentSizeChange={() =>
          flatListViewRef.current?.scrollToEnd({ animated: false })
        }
        data={props.messages}
        renderItem={renderChatMessageAsCard}
        keyExtractor={(item, index) => index.toString()}
      />
    </Panel>
  );
}
