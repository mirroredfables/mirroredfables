import * as React from "react";
import { Platform, Image } from "react-native";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import * as Linking from "expo-linking";
import NotificationButton, {
  NotificationButtonProps,
} from "./NotificationButton";

import DiscordImage from "../../../public/icons/discord.png";
import TikTokImage from "../../../public/icons/tiktok.png";
import TwitterImage from "../../../public/icons/twitter.png";
import InstagramImage from "../../../public/icons/instagram.png";
import GithubImage from "../../../public/icons/github.png";
import EmailImage from "../../../public/icons/email.png";

export const defaultNotificationButton: NotificationButtonProps = {
  icon: "https://placekitten.com/16/16",
  name: "cat.exe",
  onPress: () => {
    console.log("cat.exe pressed");
  },
};

const NotificationButtonMeta: ComponentMeta<typeof NotificationButton> = {
  title: "Molecules/Taskbar/NotificationButton",
  component: NotificationButton,
  argTypes: {},
  args: defaultNotificationButton,
};

export default NotificationButtonMeta;

type NotificationButtonStory = ComponentStory<typeof NotificationButton>;

export const Default: NotificationButtonStory = (args) => (
  <NotificationButton {...args} />
);

export const DiscordNotificationButton: NotificationButtonProps = {
  icon:
    Platform.OS === "web"
      ? "icons/discord.png"
      : Image.resolveAssetSource(DiscordImage).uri,
  name: "Discord",
  onPress: () => {
    if (Platform.OS === "web") {
      window.open("https://discord.gg/J5Frvrzg46");
    } else {
      Linking.openURL("https://discord.gg/J5Frvrzg46");
    }
  },
};

export const TikTokNotificationButton: NotificationButtonProps = {
  icon:
    Platform.OS === "web"
      ? "icons/tiktok.png"
      : Image.resolveAssetSource(TikTokImage).uri,
  name: "TikTok",
  onPress: () => {
    if (Platform.OS === "web") {
      window.open("https://www.tiktok.com/@mirroredfables");
    } else {
      Linking.openURL("https://www.tiktok.com/@mirroredfables");
    }
  },
};

export const TwitterNotificationButton: NotificationButtonProps = {
  icon:
    Platform.OS === "web"
      ? "icons/twitter.png"
      : Image.resolveAssetSource(TwitterImage).uri,
  name: "Twitter",
  onPress: () => {
    if (Platform.OS === "web") {
      window.open("https://twitter.com/mirroredfables");
    } else {
      Linking.openURL("https://twitter.com/mirroredfables");
    }
  },
};

export const InstagramNotificationButton: NotificationButtonProps = {
  icon:
    Platform.OS === "web"
      ? "icons/instagram.png"
      : Image.resolveAssetSource(InstagramImage).uri,
  name: "Instagram",
  onPress: () => {
    if (Platform.OS === "web") {
      window.open("https://www.instagram.com/mirroredfables/");
    } else {
      Linking.openURL("https://www.instagram.com/mirroredfables/");
    }
  },
};

export const GithubNotificationButton: NotificationButtonProps = {
  icon:
    Platform.OS === "web"
      ? "icons/github.png"
      : Image.resolveAssetSource(GithubImage).uri,
  name: "Github",
  onPress: () => {
    if (Platform.OS === "web") {
      window.open("https://github.com/mirroredfables");
    } else {
      Linking.openURL("https://github.com/mirroredfables");
    }
  },
};

export const EmailNotificationButton: NotificationButtonProps = {
  icon:
    Platform.OS === "web"
      ? "icons/email.png"
      : Image.resolveAssetSource(EmailImage).uri,
  name: "Email",
  onPress: () => {
    if (Platform.OS === "web") {
      window.open("mailto:hello@mirroredfables.com");
    } else {
      Linking.openURL("mailto:hello@mirroredfables.com");
    }
  },
};
