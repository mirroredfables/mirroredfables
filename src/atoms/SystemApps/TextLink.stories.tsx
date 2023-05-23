import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import TextLink, { TextLinkProps } from "./TextLink";

export const defaultTextLink: TextLinkProps = {
  onPress: () => {
    console.log("text link pressed");
  },
  text: "Text Link",
};

const TextLinkMeta: ComponentMeta<typeof TextLink> = {
  title: "Atoms/SystemApps/TextLink",
  component: TextLink,
  argTypes: {},
  args: defaultTextLink,
};

export default TextLinkMeta;

type TextLinkStory = ComponentStory<typeof TextLink>;

export const Default: TextLinkStory = (args) => <TextLink {...args} />;
