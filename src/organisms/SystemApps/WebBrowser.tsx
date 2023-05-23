// A windows 95 style web browser app for the browser, written in React Native and Typescript.

import * as React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Panel, Text, Button } from "react95-native";
import { WebView } from "react-native-webview";
import { WebView as WebViewWeb } from "react-native-web-webview";
import * as Linking from "expo-linking";
import TextInput from "../../atoms/TextInput";

interface WebBrowserProps {
  url: string;
}

export default function WebBrowser(props: WebBrowserProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inputView: {
      flexDirection: "row",
      width: "100%",
      marginBottom: 4,
    },
    textInput: {
      marginRight: 4,
    },
    buttonLeft: {
      marginRight: 4,
    },
    buttonRight: {
      marginLeft: 4,
    },
    webWarningText: {
      margin: 8,
    },
  });

  const [url, setUrl] = React.useState(props.url);
  const [urlInput, setUrlInput] = React.useState(props.url);
  const [canGoBack, setCanGoBack] = React.useState(false);
  const [canGoForward, setCanGoForward] = React.useState(false);

  const webViewRef = React.useRef(null);

  const onNavigationStateChange = (newNavState) => {
    setCanGoBack(newNavState.canGoBack);
    setCanGoForward(newNavState.canGoForward);
    setUrlInput(newNavState.url);
  };

  const handleUrlInput = () => {
    let newUrl = urlInput;
    if (urlInput.startsWith("http://") || urlInput.startsWith("https://")) {
      newUrl = urlInput;
    } else {
      newUrl = "https://" + urlInput;
    }
    setUrl(newUrl);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        <Button
          style={styles.buttonLeft}
          disabled={!canGoBack}
          onPress={() => {
            if (canGoBack) {
              webViewRef.current.goBack();
            }
          }}
        >
          {"<"}
        </Button>
        <Button
          style={styles.buttonLeft}
          disabled={!canGoForward}
          onPress={() => {
            if (canGoForward) {
              webViewRef.current.goForward();
            }
          }}
        >
          {">"}
        </Button>
        <TextInput
          autoCapitalize={"none"}
          placeholder={"enter URL"}
          value={urlInput}
          onChangeText={(newValue) => {
            setUrlInput(newValue);
          }}
          onSubmitEditing={handleUrlInput}
          keyboardType={"url"}
        />
        <Button style={styles.buttonRight} onPress={handleUrlInput}>
          go
        </Button>
        <Button
          style={styles.buttonRight}
          onPress={() => {
            if (Platform.OS === "web") {
              window.open(urlInput);
            } else {
              Linking.openURL(urlInput);
            }
          }}
        >
          open
        </Button>
      </View>
      {Platform.OS === "web" ? (
        <View style={styles.container}>
          <Text style={styles.webWarningText}>
            desktop browser support is limited
          </Text>
          {/* <Panel style={styles.container} variant="cutout"> */}
          <WebViewWeb
            style={styles.container}
            ref={webViewRef}
            source={{ uri: url }}
            onNavigationStateChange={onNavigationStateChange}
          />
          {/* </Panel> */}
        </View>
      ) : (
        <Panel style={styles.container} variant="cutout">
          <WebView
            style={styles.container}
            ref={webViewRef}
            source={{ uri: url }}
            onNavigationStateChange={onNavigationStateChange}
          />
        </Panel>
      )}
    </View>
  );
}
