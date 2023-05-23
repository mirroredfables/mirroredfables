// A windows 95 style desktop background settings app for the browser, written in React Native and Typescript.

import * as React from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView, Radio, Fieldset, Button } from "react95-native";
import TextInput from "../../atoms/TextInput";
import { DesktopBackgroundProps } from "../Desktop/DesktopBackground";

export interface DesktopBackgroundSettingsProps {
  currentBackground: DesktopBackgroundProps;
  setBackground: (background: DesktopBackgroundProps) => void;
}

export default function DesktopBackgroundSettings(
  props: DesktopBackgroundSettingsProps
) {
  const [applyChange, setApplyChange] = React.useState(false);

  const [backgroundColor, setBackgroundColor] = React.useState(
    props.currentBackground.backgroundColor || "transparent"
  );
  const [backgroundImage, setBackgroundImage] = React.useState(
    props.currentBackground.backgroundImage || ""
  );
  const [backgroundImageResizeMode, setBackgroundImageResizeMode] =
    React.useState(
      props.currentBackground.backgroundImageResizeMode || "center"
    );
  const [foregroundImage, setForegroundImage] = React.useState(
    props.currentBackground.foregroundImage || ""
  );
  const [foregroundImageResizeMode, setForegroundImageResizeMode] =
    React.useState(
      props.currentBackground.foregroundImageResizeMode || "center"
    );

  const resizeOptions = ["cover", "contain", "stretch", "repeat", "center"];

  const RadioButton = (props: {
    label: string;
    setter: (string) => void;
    getter: string;
  }) => {
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
  };

  React.useEffect(() => {
    if (applyChange) {
      setApplyChange(false);
      props.setBackground({
        backgroundColor,
        backgroundImage,
        backgroundImageResizeMode,
        foregroundImage,
        foregroundImageResizeMode,
      });
    }
  }, [applyChange]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    insideContainer: {
      margin: 4,
    },
    selectView: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    radioButton: {},
    submitButton: {
      margin: 4,
      marginTop: 0,
      marginBottom: 8,
    },
  });

  return (
    <ScrollView style={styles.container} alwaysShowScrollbars={true}>
      <View style={styles.insideContainer}>
        <Fieldset label="background color:">
          <TextInput
            autoCapitalize={"none"}
            placeholder={"#000000"}
            value={backgroundColor}
            onChangeText={(newValue) => {
              setBackgroundColor(newValue);
            }}
          />
        </Fieldset>
        <Fieldset label="background image:">
          <TextInput
            autoCapitalize={"none"}
            placeholder={"https://placekitten.com/200/200"}
            value={backgroundImage}
            onChangeText={(newValue) => {
              setBackgroundImage(newValue);
            }}
          />
        </Fieldset>
        <Fieldset label="background image resize mode:">
          <View style={styles.selectView}>
            {resizeOptions.map((option) => (
              <RadioButton
                label={option}
                key={option}
                setter={setBackgroundImageResizeMode}
                getter={backgroundImageResizeMode}
              />
            ))}
          </View>
        </Fieldset>
        <Fieldset label="foreground image:">
          <TextInput
            autoCapitalize={"none"}
            placeholder={"https://placekitten.com/200/200"}
            value={foregroundImage}
            onChangeText={(newValue) => {
              setForegroundImage(newValue);
            }}
          />
        </Fieldset>
        <Fieldset label="foreground image resize mode:">
          <View style={styles.selectView}>
            {resizeOptions.map((option) => (
              <RadioButton
                label={option}
                key={option}
                setter={setForegroundImageResizeMode}
                getter={foregroundImageResizeMode}
              />
            ))}
          </View>
        </Fieldset>
      </View>
      <Button onPress={() => setApplyChange(true)} style={styles.submitButton}>
        apply changes
      </Button>
    </ScrollView>
  );
}
