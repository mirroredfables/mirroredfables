import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react-native";
import WebBrowser from "./WebBrowser";

const WebBrowserMeta: ComponentMeta<typeof WebBrowser> = {
  title: "Organisms/SystemApps/WebBrowser",
  component: WebBrowser,
  argTypes: {},
  args: {
    url: "https://bing.com",
  },
};

export default WebBrowserMeta;

type WebBrowserStory = ComponentStory<typeof WebBrowser>;

export const Default: WebBrowserStory = (args) => <WebBrowser {...args} />;
