// A windows 95 style proxy settings app for the browser, written in React Native and Typescript.

import * as React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { ScrollView, Fieldset, Checkbox, Button } from "react95-native";
import * as Linking from "expo-linking";
import TextInput from "../../atoms/TextInput";
import TextLink from "../../atoms/SystemApps/TextLink";

interface ProxySettingsProps {
  useProxy: boolean;
  proxyKey: string;
  configureProxy: (config: { useProxy: boolean; proxyKey: string }) => void;
}

export default function ProxySettings(props: ProxySettingsProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    insideContainer: {
      margin: 4,
    },
    linkContainer: {
      margin: 4,
      marginBottom: 8,
    },
    horizontalContainer: {
      flexDirection: "row",
    },
    showSecretButton: {
      marginLeft: 4,
    },
    applyChangesButton: {
      margin: 4,
    },
  });

  const [useProxy, setUseProxy] = React.useState(props.useProxy || false);
  const [showSecretProxyKey, setShowSecretProxyKey] = React.useState(false);
  const [proxyKey, setProxyKey] = React.useState(props.proxyKey || "");
  const [applyChange, setApplyChange] = React.useState(false);

  React.useEffect(() => {
    if (applyChange) {
      setApplyChange(false);
      props.configureProxy({
        useProxy: useProxy,
        proxyKey: proxyKey,
      });
    }
  }, [applyChange]);

  const onLinkPress = () => {
    if (Platform.OS === "web") {
      window.open("https://discord.gg/J5Frvrzg46");
    } else {
      Linking.openURL("https://discord.gg/J5Frvrzg46");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.insideContainer}>
        <Checkbox
          status={useProxy ? "checked" : "unchecked"}
          onPress={() => {
            setUseProxy(!useProxy);
          }}
          label="use mirroredfables ai proxy"
        />
        <TextLink
          containerStyle={styles.linkContainer}
          onPress={onLinkPress}
          text={"get the key from our discord"}
        />
        {useProxy ? (
          <Fieldset label="proxy api key:">
            <View style={styles.horizontalContainer}>
              <TextInput
                secureTextEntry={!showSecretProxyKey}
                autoCapitalize={"none"}
                placeholder={"..."}
                value={proxyKey}
                onChangeText={(newValue) => {
                  setProxyKey(newValue);
                }}
              />
              <Button
                style={styles.showSecretButton}
                onPress={() => {
                  setShowSecretProxyKey(!showSecretProxyKey);
                }}
                active={showSecretProxyKey}
              >
                👀
              </Button>
            </View>
          </Fieldset>
        ) : (
          <></>
        )}
      </View>
      <Button
        onPress={() => setApplyChange(true)}
        style={styles.applyChangesButton}
      >
        apply changes
      </Button>
    </ScrollView>
  );
}
