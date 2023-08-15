// A windows 95 style youtube app for the browser, written in React Native and Typescript.

import * as React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { WebView as WebViewWeb } from "react-native-web-webview";

interface YoutubePlayerProps {
  videoId?: string;
  playlist?: string;
  height?: number;
  width?: number;
  autoplay?: boolean;
  loop?: boolean;
}

export default function ParrotYoutubePlayer(props: YoutubePlayerProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
    },
    webviewContainer: {
      flex: 1,
    },
  });

  const webViewRef = React.useRef(null);

  const iframe = `
<!DOCTYPE html>
<html>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <body>
    <!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
    <div id="player"></div>

    <script>
      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: "${props.height ?? 390}",
          width: "${props.width ?? 640}",
          videoId: "${props.videoId ?? "M7lc1UVf-VE"}",
          playerVars: {
              'playsinline': 1,
              'autoplay':  ${props.autoplay ? 1 : 0},
              'loop': ${props.loop ? 1 : 0},
              'playlist': "${props.playlist ?? props.videoId}",
              // 'mute': 1
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
        event.target.unMute();
        event.target.setVolume(50);
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for 1 second and then unmute.
      var unmuted = false;
      function onPlayerStateChange(event) {
        // if (event.data == YT.PlayerState.PLAYING && !unmuted) {
        //   setTimeout(unMuteVideo, 1000);
        //   unmuted = true;
        // }
      }
      function stopVideo() {
        player.stopVideo();
      }
      function unMuteVideo() {
        player.unMute();
      }
    </script>
  </body>
</html>
`;

  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <WebViewWeb
          style={styles.container}
          ref={webViewRef}
          source={{ html: iframe }}
        />
      ) : (
        <WebView
          style={styles.container}
          ref={webViewRef}
          source={{ html: iframe }}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          scalesPageToFit={true}
          containerStyle={styles.webviewContainer}
        />
      )}
    </View>
  );
}
