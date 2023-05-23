// A windows 95 style welcome wizard button, written in React Native and Typescript.

import * as React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react95-native";

interface WelcomeWizardButtonProps {
  name: string;
  onPress: () => void;
}

export default function WelcomeWizardButton(props: WelcomeWizardButtonProps) {
  const styles = StyleSheet.create({
    button: {
      flexGrow: 1,
    },
  });

  return (
    <Button style={styles.button} onPress={props.onPress}>
      {props.name}
    </Button>
  );
}
