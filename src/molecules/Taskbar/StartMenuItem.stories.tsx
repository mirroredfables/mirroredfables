import * as React from "react";
import { Platform, Image } from "react-native";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import * as Linking from "expo-linking";
import StartMenuItem, { StartMenuItemProps } from "./StartMenuItem";

import NotepadImage from "../../../public/icons/notepad.png";

export const defaultStartMenuItem: StartMenuItemProps = {
  icon: "https://placekitten.com/16/16",
  name: "hello world.exe",
  onPress: () => {
    console.log("start menu item pressed");
  },
};

const StartMenuItemMeta: ComponentMeta<typeof StartMenuItem> = {
  title: "Molecules/Taskbar/StartMenuItem",
  component: StartMenuItem,
  argTypes: {},
  args: defaultStartMenuItem,
};

export default StartMenuItemMeta;

type StartMenuItemStory = ComponentStory<typeof StartMenuItem>;

export const Default: StartMenuItemStory = (args) => (
  <StartMenuItem {...args} />
);

export const TermsStartMenuItem: StartMenuItemProps = {
  icon:
    Platform.OS === "web"
      ? "icons/notepad.png"
      : Image.resolveAssetSource(NotepadImage).uri,
  name: "terms of service",
  onPress: () => {
    if (Platform.OS === "web") {
      window.open("https://www.mirroredfables.com/terms.html");
    } else {
      Linking.openURL("https://www.mirroredfables.com/terms.html");
    }
  },
};

export const PrivacyStartMenuItem: StartMenuItemProps = {
  icon:
    Platform.OS === "web"
      ? "icons/notepad.png"
      : Image.resolveAssetSource(NotepadImage).uri,
  name: "privacy policy",
  onPress: () => {
    if (Platform.OS === "web") {
      window.open("https://www.mirroredfables.com/privacy.html");
    } else {
      Linking.openURL("https://www.mirroredfables.com/privacy.html");
    }
  },
};

export const AcknowledgementsStartMenuItem: StartMenuItemProps = {
  icon:
    Platform.OS === "web"
      ? "icons/notepad.png"
      : Image.resolveAssetSource(NotepadImage).uri,
  name: "thank yous",
  onPress: () => {
    if (Platform.OS === "web") {
      window.open("https://www.mirroredfables.com/acknowledgements.html");
    } else {
      Linking.openURL("https://www.mirroredfables.com/acknowledgements.html");
    }
  },
};
