// A windows 95 style text input for the browser, written in React Native and Typescript.

import React from "react";
import {
  View,
  StyleSheet,
  TextInput as NativeTextInput,
  TextInputProps,
} from "react-native";
import { useTheme } from "react95-native";

export default function TextInput({
  children,
  style = {},
  editable = true,
  value,
  defaultValue,
  ...rest
}: React.PropsWithChildren<TextInputProps>) {
  const theme = useTheme();

  const hasValue = !!(value || defaultValue);

  const getSharedStyles = (() => {
    const radius = 0;
    let r = radius + 4;
    return () => {
      r -= 2;
      return [
        styles.borderPosition,
        {
          borderRadius: radius ? r : 0,
        },
      ];
    };
  })();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    wrapper: {
      flex: 1,
      padding: 4,
      justifyContent: "center",
      minHeight: 36,
    },
    textInput: {
      flex: 1,
      paddingHorizontal: 4,
      backgroundColor: editable ? theme.canvas : theme.material,
    },
    borderPosition: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    cutoutOuter: {
      borderWidth: 2,
      borderLeftColor: theme.borderDark,
      borderTopColor: theme.borderDark,
      borderRightColor: theme.borderLightest,
      borderBottomColor: theme.borderLightest,
    },
    cutoutInner: {
      borderWidth: 2,
      borderLeftColor: theme.borderDarkest,
      borderTopColor: theme.borderDarkest,
      borderRightColor: theme.borderLight,
      borderBottomColor: theme.borderLight,
    },
    regular: {
      fontFamily: "MS Sans Serif",
      fontSize: 16,
    },
    bold: {
      fontFamily: "MS Sans Serif Bold",
      fontSize: 16,
    },
    secondary: {
      color: theme.materialTextDisabled,
    },
    default: {
      color: theme.materialText,
    },
    disabled: {
      color: theme.materialTextDisabled,
      textShadowColor: theme.materialTextDisabledShadow,
      textShadowOffset: {
        width: 1,
        height: 1,
      },
      textShadowRadius: 0,
    },
  });

  return (
    <View style={[styles.wrapper]}>
      <View style={[getSharedStyles()]}>
        <View style={[getSharedStyles(), styles.cutoutOuter]}>
          <View style={[getSharedStyles(), styles.cutoutInner]}>
            <NativeTextInput
              style={[
                styles.textInput,
                styles.regular,
                editable && hasValue ? styles.default : styles.disabled,
                style,
              ]}
              placeholderTextColor={theme.materialTextDisabled}
              editable={editable}
              value={value}
              defaultValue={defaultValue}
              {...rest}
            >
              {children}
            </NativeTextInput>
          </View>
        </View>
      </View>
    </View>
  );
}
