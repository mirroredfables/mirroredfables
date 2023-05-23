// A windows 95 style system wide snackbar, written in React Native and Typescript.

import * as React from "react";

import { StyleSheet } from "react-native";
import { Snackbar } from "react95-native";

export interface SystemSnackbarProps {
  message: string;
  visible: boolean;
  onDismiss?: () => void;
  duration?: number;
}

export default function SystemSnackbar(props: SystemSnackbarProps) {
  const styles = StyleSheet.create({
    snackBarWrapper: {
      bottom: 75,
      left: 0,
    },
  });

  return (
    <Snackbar
      wrapperStyle={styles.snackBarWrapper}
      visible={props.visible}
      duration={props.duration ? props.duration : Snackbar.DURATION_MEDIUM}
      onDismiss={props.onDismiss}
      action={{
        label: "ok",
        onPress: () => {
          // Do something
        },
      }}
    >
      {props.message}
    </Snackbar>
  );
}
