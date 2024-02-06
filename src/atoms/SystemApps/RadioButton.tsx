import React from "react";
import { StyleSheet } from "react-native";
import { Radio } from "react95-native";

export interface RadioButtonProps {
  label: string;
  setter: (string) => void;
  getter: string;
}

export default function RadioButton(props: RadioButtonProps) {
  const styles = StyleSheet.create({
    radioButton: {
      // margin: 4,
    },
  });

  return (
    <Radio
      status={props.getter === props.label ? "checked" : "unchecked"}
      onPress={() => {
        props.setter(props.label);
      }}
      label={props.label}
      style={styles.radioButton}
    />
  );
}
