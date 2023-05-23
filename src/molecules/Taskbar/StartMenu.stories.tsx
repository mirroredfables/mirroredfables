import * as React from "react";
import { Platform, Image } from "react-native";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import StartMenu, { StartMenuProps } from "./StartMenu";
import {
  defaultStartMenuItem,
  AcknowledgementsStartMenuItem,
  PrivacyStartMenuItem,
  TermsStartMenuItem,
} from "./StartMenuItem.stories";
import Icon from "../../../public/icon.png";

const startIcon =
  Platform.OS === "web" ? "icon.png" : Image.resolveAssetSource(Icon).uri;

export const defaultStartMenu: StartMenuProps = {
  startButtonIcon: startIcon,
  startButtonName: "start",
  items: [
    TermsStartMenuItem,
    PrivacyStartMenuItem,
    AcknowledgementsStartMenuItem,
  ],
};

const StartMenuMeta: ComponentMeta<typeof StartMenu> = {
  title: "Molecules/Taskbar/StartMenu",
  component: StartMenu,
  argTypes: {},
  args: defaultStartMenu,
};

export default StartMenuMeta;

type StartMenuStory = ComponentStory<typeof StartMenu>;

export const Default: StartMenuStory = (args) => <StartMenu {...args} />;
