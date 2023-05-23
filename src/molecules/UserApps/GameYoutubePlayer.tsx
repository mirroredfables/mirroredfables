// A youtube video player plugin, written in React Native and Typescript.

import * as React from "react";
import { View, StyleSheet } from "react-native";
import ParrotYoutubePlayer from "../../organisms/SystemApps/YoutubePlayer";

interface GameYoutubePlayerProps {
  videoId: string;
  hidden?: boolean;
  disabled?: boolean;
}

export default function GameYoutubePlayer(props: GameYoutubePlayerProps) {
  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      display: props.hidden ? "none" : "flex",
    },
  });

  if (props.disabled) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ParrotYoutubePlayer
        videoId={props.videoId}
        height={113}
        width={200}
        autoplay={true}
        loop={true}
      />
    </View>
  );
}
