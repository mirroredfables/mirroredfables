// A windows 95 style window the browser, written in React Native and Typescript.

import * as React from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import { Panel, Text, useTheme } from "react95-native";
import WindowTitleButton from "../../atoms/Window/WindowTitleButton";

export interface WindowState {
  id: number;
  depth: number;
  active: boolean;
  minimized: boolean;
  maximized: boolean;
  fullscreened: boolean;
  resizable: boolean;
  width: number;
  height: number;
  positionX: number;
  positionY: number;
}

export interface WindowStateManager {
  minimize: () => void;
  maximize: () => void;
  fullscreen: () => void;
  exitFullscreen: () => void;
  hideExitFullScreenButton?: boolean;
  restore: () => void;
  close: () => void;
  resize: (width: number, height: number) => void;
  move: (x: number, y: number) => void;
  // should trigger when the window is touched
  activate: () => void;
}

export interface WindowProps {
  name: string;
  icon?: string;
  children: React.ReactNode;
  state: WindowState;
  manager: WindowStateManager;
}

export default function Window(props: WindowProps) {
  const MIN_WIDTH = 200;
  const MIN_HEIGHT = 200;

  const [position, setPosition] = React.useState({
    x: props.state.positionX,
    y: props.state.positionY,
  });
  const [offsetMove, setOffsetMove] = React.useState({ x: 0, y: 0 });
  const [moved, setMoved] = React.useState(false);
  const [dimensions, setDimensions] = React.useState({
    width: props.state.width,
    height: props.state.height,
  });
  const [offsetResize, setOffsetResize] = React.useState({ x: 0, y: 0 });
  const [resized, setResized] = React.useState(false);

  const theme = useTheme();

  const moveWindowResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onStartShouldSetPanResponderCapture: (event, gestureState) => true,
      onMoveShouldSetPanResponder: (event, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (event, gestureState) => true,

      onPanResponderGrant: (event, gestureState) => {
        props.manager.activate();
      },
      onPanResponderMove: (event, gestureState) => {
        setOffsetMove({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderTerminationRequest: (event, gestureState) => true,
      onPanResponderRelease: (event, gestureState) => {
        setMoved(true);
      },
      onPanResponderTerminate: (event, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (event, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    })
  ).current;

  // this triggers after resizing, firing off the resize event to redux
  React.useEffect(() => {
    if (moved) {
      setPosition((position) => {
        return { x: position.x + offsetMove.x, y: position.y + offsetMove.y };
      });
      setOffsetMove({ x: 0, y: 0 });
      props.manager.move(position.x + offsetMove.x, position.y + offsetMove.y);
      setMoved(false);
    }
  }, [moved]);

  const resizeWindowResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onStartShouldSetPanResponderCapture: (event, gestureState) => true,
      onMoveShouldSetPanResponder: (event, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (event, gestureState) => true,

      onPanResponderGrant: (event, gestureState) => {
        props.manager.activate();
      },
      onPanResponderMove: (event, gestureState) => {
        setOffsetResize({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderTerminationRequest: (event, gestureState) => true,
      onPanResponderRelease: (event, gestureState) => {
        setResized(true);
      },
      onPanResponderTerminate: (event, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (event, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    })
  ).current;

  // this triggers after resizing, firing off the resize event to redux
  React.useEffect(() => {
    if (resized) {
      setDimensions((dimensions) => {
        let newWidth = dimensions.width + offsetResize.x;
        let newHeight = dimensions.height + offsetResize.y;
        if (dimensions.width + offsetResize.x < MIN_WIDTH) {
          newWidth = MIN_WIDTH;
        }
        if (dimensions.height + offsetResize.y < MIN_HEIGHT) {
          newHeight = MIN_HEIGHT;
        }
        props.manager.resize(newWidth, newHeight);
        return {
          width: newWidth,
          height: newHeight,
        };
      });
      setOffsetResize({ x: 0, y: 0 });
      setResized(false);
    }
  }, [resized]);

  const styles = StyleSheet.create({
    window: {
      zIndex: props.state.depth,
      position: "absolute",
      top: position.y + offsetMove.y,
      left: position.x + offsetMove.x,
      width: dimensions.width + offsetResize.x,
      height: dimensions.height + offsetResize.y,
      minWidth: MIN_WIDTH,
      minHeight: MIN_HEIGHT,
    },
    windowMaximized: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
    windowMinimized: {
      display: "none",
    },
    windowTitleBar: {
      flexDirection: "row",
      backgroundColor: props.state.active
        ? theme.headerBackground
        : theme.headerNotActiveBackground,
      padding: 4,
    },
    windowTitleMoveView: {
      flexShrink: 1,
      flexGrow: 1,
    },
    windowTitleText: {
      marginTop: 4,
      marginLeft: 4,
      flexShrink: 1,
      flexGrow: 1,
      color: props.state.active ? theme.headerText : theme.headerNotActiveText,
    },
    windowTitleButtonGroup: {
      flexDirection: "row",
      marginLeft: 4,
    },
    windowContent: {
      padding: 4,
      flex: 1,
    },
    resizeButton: {
      position: "absolute",
      bottom: 3,
      right: 3,
    },
    resizeButtonText: {
      marginBottom: -3,
    },
    windowFullscreened: {
      zIndex: props.state.depth,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: theme.material,
    },
    exitFullscreenButton: {
      position: "absolute",
      top: 0,
      left: 0,
    },
    windowContentFullscreened: {
      flex: 1,
    },
  });

  if (props.state.fullscreened) {
    return (
      <View style={styles.windowFullscreened}>
        <View style={styles.windowContentFullscreened}>{props.children}</View>
        {!props.manager.hideExitFullScreenButton ? (
          <View style={styles.exitFullscreenButton}>
            <WindowTitleButton
              name={"exitFullscreen"}
              icon={"fullscreen-exit"}
              onPress={() => props.manager.exitFullscreen()}
            />
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <Panel
      variant="raised"
      key={props.state.id}
      style={[
        styles.window,
        props.state.maximized ? styles.windowMaximized : null,
        props.state.minimized ? styles.windowMinimized : null,
      ]}
    >
      <View style={styles.windowTitleBar}>
        <View
          style={styles.windowTitleMoveView}
          {...moveWindowResponder.panHandlers}
        >
          <Text
            style={styles.windowTitleText}
            // bold={true}
            numberOfLines={1}
            ellipsizeMode={"tail"}
            selectable={false}
          >
            {props.name}
          </Text>
        </View>
        <View style={styles.windowTitleButtonGroup}>
          <WindowTitleButton
            name={"minimize"}
            icon={"window-minimize"}
            onPress={() => props.manager.minimize()}
          />
          {props.state.maximized ? (
            <WindowTitleButton
              name={"restore"}
              icon={"window-restore"}
              onPress={() => props.manager.restore()}
            />
          ) : (
            <WindowTitleButton
              name={"maximize"}
              icon={"window-maximize"}
              onPress={() => props.manager.maximize()}
            />
          )}
          <WindowTitleButton
            name={"fullscreen"}
            icon={"fullscreen"}
            onPress={() => props.manager.fullscreen()}
          />
        </View>
        <View style={styles.windowTitleButtonGroup}>
          <WindowTitleButton
            name={"close"}
            icon={"window-close"}
            onPress={() => props.manager.close()}
          />
        </View>
      </View>
      <View style={styles.windowContent}>{props.children}</View>
      {props.state.resizable && !props.state.maximized ? (
        <View
          style={styles.resizeButton}
          {...resizeWindowResponder.panHandlers}
        >
          <Text style={styles.resizeButtonText} selectable={false}>
            ◢
          </Text>
        </View>
      ) : null}
    </Panel>
  );
}
