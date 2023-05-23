import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import TextInput from "./TextInput";

const TextInputMeta: ComponentMeta<typeof TextInput> = {
  title: "Atoms/TextInput",
  component: TextInput,
  argTypes: {},
  args: {},
};

export default TextInputMeta;

type TextInputStory = ComponentStory<typeof TextInput>;

export const Default: TextInputStory = (args) => <TextInput {...args} />;

export const WithPlaceholder: TextInputStory = (args) => (
  <TextInput {...args} placeholder={"hello world"} />
);

export const WithValue: TextInputStory = (args) => (
  <TextInput {...args} value={"hello world"} />
);

export const Disabled: TextInputStory = (args) => (
  <TextInput {...args} editable={false} />
);
