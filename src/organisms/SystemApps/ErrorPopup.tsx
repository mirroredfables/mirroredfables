// A windows 95 style error screen for the browser, written in React Native and Typescript.

import * as React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Text, Button, Divider } from "react95-native";
import * as Linking from "expo-linking";
import TextLink from "../../atoms/SystemApps/TextLink";

interface ErrorPopupProps {
  errorMessage?: string;
  discordLinkMessage?: string;
}

export default function ErrorPopup(props: ErrorPopupProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 8,
    },

    errorText: {
      marginTop: 8,
      marginBottom: 8,
    },
    errorTextDiscordLink: {
      marginTop: 8,
      marginBottom: 8,
    },
    // buttonGroupView: {
    //   // flexDirection: "row",
    //   // flexWrap: "wrap",
    //   justifyContent: "space-between",
    //   marginVertical: 8,
    // },
    // button: {
    //   flexGrow: 1,
    // },
  });

  const defaultProxyErrorMessage =
    "the proxy key you are using has exceeded its limit. please try again tomorrow or change it to a different key. you can still play our pre-generated games though!";

  const defaultDiscordLinkMessage =
    "ps, you can request a personal proxy key in our discord!";

  const onDiscordLinkPress = () => {
    if (Platform.OS === "web") {
      window.open("https://discord.gg/J5Frvrzg46");
    } else {
      Linking.openURL("https://discord.gg/J5Frvrzg46");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>
        {props.errorMessage ?? defaultProxyErrorMessage}
      </Text>
      <TextLink
        containerStyle={styles.errorTextDiscordLink}
        onPress={onDiscordLinkPress}
        text={props.discordLinkMessage ?? defaultDiscordLinkMessage}
      />

      {/* <Divider />
      <View style={styles.buttonGroupView}>
        <Button style={styles.button} onPress={props.onDismiss}>
          ok
        </Button>
      </View> */}
    </View>
  );
}
