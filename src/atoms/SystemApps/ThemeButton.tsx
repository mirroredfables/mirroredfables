import React from "react";
import {
  StyleSheet,
  View,
  TouchableHighlight,
  ImageBackground,
} from "react-native";
import { Text, Panel, ThemeProvider, Theme } from "react95-native";

export interface ThemeButtonProps {
  onPress: () => void;
  width?: number;
  height?: number;
  selected?: boolean;
  theme: Theme;
  currentTheme: Theme;
}

export default function ThemeButton(props: ThemeButtonProps) {
  const buttonHeight = props.height || 50;
  const buttonWidth = props.width || 100;
  const selectedBorderWidth = 2;

  const styles = StyleSheet.create({
    themeButtonWrapper: {
      alignItems: "center",
      width: buttonWidth,
    },
    button: {
      marginBottom: 4,
      borderWidth: selectedBorderWidth,
      padding: 4,
      borderColor: props.selected ? props.theme.focusSecondary : "transparent",
    },
    square: {
      height: buttonHeight,
      width: buttonWidth - 20,
    },
    header: {
      position: "absolute",
      height: 10,
      left: 4,
      top: 4,
      right: 4,
      backgroundColor: props.theme.headerBackground,
    },
    themeButtonName: {
      maxWidth: buttonWidth - 20,
      textAlign: "center",
      flexShrink: 1,
    },
  });

  return (
    <View style={[styles.themeButtonWrapper]}>
      <ThemeProvider theme={props.currentTheme}>
        <TouchableHighlight onPress={props.onPress} style={styles.button}>
          <View>
            <Panel theme={props.theme} variant="raised" style={styles.square}>
              <View style={styles.header} />
              {props.selected && (
                <ImageBackground
                  style={{ width: "100%", height: "100%" }}
                  imageStyle={{
                    resizeMode: "repeat",
                  }}
                  source={{
                    uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAIUlEQVQoU2P8////fwYkwMjIyIjCp4MCZPtAbAwraa8AAEGrH/nfAIhgAAAAAElFTkSuQmCC",
                  }}
                />
              )}
            </Panel>
            <Text
              bold={props.selected}
              numberOfLines={1}
              ellipsizeMode={"tail"}
              style={styles.themeButtonName}
            >
              {props.theme.name}
            </Text>
          </View>
        </TouchableHighlight>
      </ThemeProvider>
    </View>
  );
}
