// A windows 95 style proxy settings app for the browser, written in React Native and Typescript.

import * as React from "react";
import { View, StyleSheet } from "react-native";
import { ScrollView, Fieldset, Checkbox, Button } from "react95-native";
import TextInput from "../../atoms/TextInput";

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
    applyChangesButton: {
      margin: 4,
    },
  });

  const [useProxy, setUseProxy] = React.useState(props.useProxy || false);
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
        {useProxy ? (
          <Fieldset label="proxy api key:">
            <TextInput
              autoCapitalize={"none"}
              placeholder={"..."}
              value={proxyKey}
              onChangeText={(newValue) => {
                setProxyKey(newValue);
              }}
            />
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
