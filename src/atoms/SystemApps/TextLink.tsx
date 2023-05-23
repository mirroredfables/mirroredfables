import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Text } from "react95-native";

export interface TextLinkProps {
  onPress: () => void;
  text: string;
  containerStyle?: any;
  textStyle?: any;
}

export default function TextLink(props: TextLinkProps) {
  const styles = StyleSheet.create({
    clickableTextContainer: {},
    clickableText: {
      color: "blue",
      textDecorationLine: "underline",
    },
  });

  return (
    <Pressable
      style={[styles.clickableTextContainer, props.containerStyle]}
      onPress={props.onPress}
    >
      <Text style={[styles.clickableText, props.textStyle]}>{props.text}</Text>
    </Pressable>
  );
}
