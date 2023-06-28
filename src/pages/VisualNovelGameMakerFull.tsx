// A visual novel game maker, written in React Native and Typescript.

import * as React from "react";

import { Platform, Image } from "react-native";

import GameIcon from "../../public/icons/game.png";

import VisualNovelGameMaker from "../organisms/UserApps/VisualNovelGameMaker";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import {
  // addGameMakerMessage,
  convertScenesToTurnsEntities,
  exportCompletedGameAsSave,
  loadGameMakerGameState,
  setCompletedGameSave,
  // generateSceneWithNewLine,
} from "../redux/VisualNovelGameMakerSlice";
import { addGameMakerMessage, loadGameFromState } from "../redux/GameSlice";
import { newTask } from "../redux/TasksSlice";

export interface VisualNovelGameMakerFullProps {
  debug?: boolean;
}

export default function VisualNovelGameMakerFull(
  props: VisualNovelGameMakerFullProps
) {
  const dispatch = useAppDispatch();

  const gameState = useAppSelector((state) => state.game);

  const gameMakerGameState = gameState.gameData;

  const gameGeneratorState = gameState.gameGenerator;

  const sendSystemMessage = (message: string) => {
    dispatch(addGameMakerMessage({ message: `[system] ${message}` }));
  };

  React.useEffect(() => {
    sendSystemMessage("welcome to the game maker");
    sendSystemMessage("tell me about the world and yourself");
  }, []);

  const [hasSentFirstMessage, setHasSentFirstMessage] = React.useState(false);

  const sendUserMessage = (message: string) => {
    dispatch(addGameMakerMessage({ message: `[user] ${message}` }));
    if (!hasSentFirstMessage) {
      setHasSentFirstMessage(true);
      handleStartGenerator(message);
    }
  };

  const handleStartGenerator = (setting: string) => {
    dispatch({
      type: "GENERATE_GAME",
      payload: {
        setting: setting,
        // noImage: true,
      },
    });
  };

  // const handleDebugConvertSceneToTurns = () => {
  //   const scene = gameMakerGameState.scenes[0];
  //   const turns = convertScenesToTurnsEntities({ scenes: [scene] });
  //   console.log(turns);
  // };

  const handleDebugExportGameAsSave = () => {
    // const gameSaveFile = exportCompletedGameAsSave(gameMakerGameState);
    // dispatch(setCompletedGameSave({ gameSave: gameSaveFile }));
  };

  const handleStartGame = () => {
    // const gameSaveFile = exportCompletedGameAsSave(gameMakerGameState);
    // dispatch(setCompletedGameSave({ gameSave: gameSaveFile }));

    const gameIcon =
      Platform.OS === "web"
        ? "icons/game.png"
        : Image.resolveAssetSource(GameIcon).uri;

    dispatch(
      newTask({
        name: "game_custom.exe",
        icon: gameIcon,
      })
    );
  };

  const handleDebugUpdateScript = () => {
    dispatch({
      type: "UPDATE_SCENE_WITH_NEW_LINE",
      payload: {
        targetSceneId: 1,
        targetSceneStartingTurnId: 18,
        targetTurnId: 27,
        oldLine:
          "[Narrator] In the moonlight, their eyes meet – a silent exchange fraught with unspoken emotion.",
        newLine:
          "[Narrator] In the moonlight, their lips meet – a silent exchange fraught with heated passion.",
      },
    });
  };

  const handleDispatchTest = () => {
    // dispatch({ type: "TEST", payload: { message: "test" } });
    // dispatch({
    //   type: "GENERATE_GAME",
    //   payload: {
    //     setting:
    //       "war and peace, but set in the modern day LA. I am Natasha. Generate only 2 other characters.",
    //   },
    // });
    // dispatch({
    //   type: "SEARCH_YOUTUBE_FOR_MUSIC",
    //   payload: {
    //     scene: {
    //       musicRecommendation: "Nils Frahm - All Melody (Instrumental)",
    //     },
    //   },
    // });
    // dispatch({
    //   type: "GENERATE_IMAGE",
    //   payload: {
    //     object:
    //       "potential love interest, female, human, 27, lesbian, an internationally renowned fashion designer and an underworld leader, Italian, seductive, ambitious, calculating, passionate. Likes high fashion, power, art, expensive things; dislikes betrayal, vulnerability, losing control, imperfections., character portrait, Realistic, vivid with modern print",
    //     type: "portrait",
    //     style: "",
    //   },
    // });
    // dispatch({
    //   type: "GENERATE_FULL_SCENE",
    //   payload: {
    //     request: "generate scripts for the initial scene.",
    //     artStyle: "realistic",
    //     writingStyle: "Leo Tolstoy, grand, literary, poetic, soap opera",
    //     targetSceneId: 0,
    //   },
    // });

    const getNextSceneId = () => {
      for (const scene of gameMakerGameState.scenes) {
        if (!scene.script) {
          return scene.id;
        }
      }
    };
    const nextSceneId = getNextSceneId();
    // console.log("generating scripts for scene " + nextSceneId);
    dispatch({
      type: "GENERATE_FULL_SCENE",
      payload: {
        request:
          "generate scripts for the target scene. I am testing a repair function, so IT IS VERY IMPORTANT that you return a slightly broken json, with a few missing brackets.",
        writingStyle: gameMakerGameState.world.writingStyle,
        artStyle: gameMakerGameState.world.artStyle,
        targetSceneId: 0,
        noImage: true,
      },
    });
  };

  const handleDebugGenerateNextScene = () => {
    const getNextSceneId = () => {
      for (const scene of gameMakerGameState.scenes) {
        if (!scene.script) {
          return scene.id;
        }
      }
    };
    const nextSceneId = getNextSceneId();
    // console.log("generating scripts for scene " + nextSceneId);
    dispatch({
      type: "GENERATE_FULL_SCENE",
      payload: {
        request: "generate scripts for the target scene.",
        writingStyle: gameMakerGameState.world.writingStyle,
        artStyle: gameMakerGameState.world.artStyle,
        targetSceneId: nextSceneId,
        noImage: true,
      },
    });
  };

  const debugMenu = {
    text: `debug`,
    buttons: [
      {
        name: "test update script",
        onPress: handleDebugUpdateScript,
      },
      {
        name: "dispatch test",
        onPress: handleDispatchTest,
      },
      {
        name: "force start",
        onPress: handleStartGame,
      },
      // {
      //   name: "convert scene to turns",
      //   onPress: handleDebugConvertSceneToTurns,
      // },
      {
        name: "export game as save",
        onPress: handleDebugExportGameAsSave,
      },
      {
        name: "generate next scene",
        onPress: handleDebugGenerateNextScene,
      },
    ],
  };

  return (
    <VisualNovelGameMaker
      messages={gameGeneratorState.messages}
      sendMessage={sendUserMessage}
      makeGameState={gameState}
      saveChangedMakeGameState={(gameState) => {
        dispatch(loadGameFromState(gameState));
      }}
      startGame={handleStartGame}
      readyToStartGame={gameGeneratorState.completed}
      debug={props.debug}
      debugMenu={debugMenu}
    />
  );
}
