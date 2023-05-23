import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import Chat from "./Chat";

const ChatMeta: ComponentMeta<typeof Chat> = {
  title: "Organisms/SystemApps/Chat",
  component: Chat,
  argTypes: {},
  args: {
    messages: [
      "Hello, world!",
      "This is a chat app.",
      "It's not very good yet, but it will be soon!",
    ],
    sendMessage: (message: string) => console.log(message),
  },
};

export default ChatMeta;

type ChatStory = ComponentStory<typeof Chat>;

export const Default: ChatStory = (args) => <Chat {...args} />;
