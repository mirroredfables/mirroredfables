// A visual novel game with state, written in React Native and Typescript.

import * as React from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import * as Clipboard from "expo-clipboard";
import Constants from "expo-constants";
import { defaultGameBackground } from "../atoms/UserApps/GameBackground.stories";
import GameConfigMenu from "../molecules/UserApps/GameConfigMenu";
import GameScriptHistory from "../molecules/UserApps/GameScriptHistory";
import GameLoadMenu from "../molecules/UserApps/GameLoadMenu";
import VisualNovelGame from "../organisms/UserApps/VisualNovelGame";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import {
  closeTask,
  exitFullscreenTask,
  fullscreenTask,
  Task,
} from "../redux/TasksSlice";
import {
  setAutoNextTurn,
  nextTurn,
  selectTurnById,
  setConfig,
  setInit,
  selectAllTurns,
  setShowHistory,
  GameSaveFile,
  setShowLoadSave,
  loadGameFromSave,
  setSpeech,
  setShowCredits,
  resetGamePlayerState,
  setMusic,
  setHideYoutube,
  setAutoGenerate,
  setTextSize,
} from "../redux/VisualNovelGameTurnsSlice";
import GameCredits from "../molecules/UserApps/GameCredits";
import GameStartMenu from "../molecules/UserApps/GameStartMenu";
import GameDebugVoiceTestMenu from "../molecules/UserApps/GameDebugVoiceTestMenu";
import GameYoutubePlayer from "../molecules/UserApps/GameYoutubePlayer";
import { setSnackbar } from "../redux/SystemSettingsSlice";
import { usePostTextToSpeechMutation } from "../redux/ElevenLabsSlice";
import { VisualNovelGameMusic } from "../redux/VisualNovelGameTypes";
import { saveGameToServer } from "../redux/VisualNovelGameMakerSlice";

export interface VisualNovelGameFullProps {
  task: Task;
  game: GameSaveFile;
}

export default function VisualNovelGameFull(props: VisualNovelGameFullProps) {
  const dispatch = useAppDispatch();

  const debugStatus = useAppSelector((state) => state.systemSettings.debug);

  const [currentSavedGames, setCurrentSavedGames] = React.useState<
    GameSaveFile[]
  >([]);

  const initialized = useAppSelector(
    (state) => state.visualNovelGameTurns.init
  );

  React.useEffect(() => {
    // this loads the game from the initial game save state file
    // dispatch(loadGameFromSave({ state: props.game.data }));
  }, []);

  const currentGameState = useAppSelector(
    (state) => state.visualNovelGameTurns
  );

  const currentTurnId = currentGameState.currentTurnId;

  const currentTurn = useAppSelector((state) =>
    selectTurnById(state, currentTurnId)
  );

  const currentTurnText = currentTurn ? currentTurn.text : "loading...";

  const currentSceneId = currentTurn ? currentTurn.sceneId : 0;

  const currentScene = currentGameState.scenes[currentSceneId];

  const currentMusic = currentScene ? currentScene.music : null;

  const currentBackground = currentScene
    ? currentScene.background
    : defaultGameBackground;

  const currentPortraits = currentTurn
    ? currentGameState.currentCharacters
    : [];

  const currentActivePortraitName = currentTurn
    ? currentTurn.activePortrait
    : "none";

  // generative stuff
  const allTurns = useAppSelector((state) => selectAllTurns(state));
  const latestTurn = allTurns[allTurns.length - 1];

  interface GenerateScenesResponseData {
    scenes: {
      id: number;
      name: string;
      location: string;
      background?: {
        image: string;
        name: string;
      };
    }[];
  }

  const generateMoreScenes = () => {
    dispatch({
      type: "GENERATE_MORE_SCENES",
      payload: {
        request: "generate 12 more scenes based on the story so far.",
      },
    });
  };

  interface GenerateScriptResponseData {
    script: { id: number; line: string }[];
    scene: {
      id: number;
      name: string;
      location: string;
      summary?: string;
      background?: {
        image: string;
        name: string;
      };
    };
  }

  const generateMoreScript = () => {
    const nextSceneId = latestTurn ? latestTurn.sceneId + 1 : 0;
    // console.log("generating scripts for scene " + nextSceneId);
    dispatch({
      type: "GENERATE_FULL_SCENE",
      payload: {
        request: "generate scripts for the target scene.",
        writingStyle: currentGameState.world.writingStyle,
        artStyle: currentGameState.world.artStyle,
        targetSceneId: nextSceneId,
      },
    });
  };

  //
  const convertGameToJson = () => {
    const newExport: GameSaveFile = {
      id: 0,
      timestamp: Date.now(),
      previewText: currentTurn.text,
      gameEngineVersion: "0",
      data: {
        ...currentGameState,
        init: false,
        showConfig: false,
        currentSceneId: 0,
        currentTurnId: 0,
        currentCharacters: [],
      },
    };
    return newExport;
  };

  // export game
  const exportGame = async () => {
    const exportJsonString = JSON.stringify(convertGameToJson());
    Clipboard.setStringAsync(exportJsonString);
    dispatch(
      setSnackbar({
        message: "game exported to clipboard",
        visible: true,
        duration: 10000,
      })
    );
  };

  // export game and upload to server
  const exportGameToServer = async () => {
    const exportJson = convertGameToJson();
    dispatch(saveGameToServer({ game: exportJson })).then((result) => {
      console.log(result);
      if (result.meta.requestStatus === "fulfilled") {
        const savedUuid = result.payload.uuid;
        Clipboard.setStringAsync(savedUuid);
        dispatch(
          setSnackbar({
            message: "game exported to clipboard and saved to server",
            visible: true,
            duration: 10000,
          })
        );
      } else {
        dispatch(
          setSnackbar({
            message: "game export failed to be saved to server",
            visible: true,
            duration: 10000,
          })
        );
      }
    });
  };

  // import game (it's just loading from save state from clipboard)
  // BUG: first turn has an empty currentCharacters
  const importGame = async () => {
    const importedGame = await Clipboard.getStringAsync();
    try {
      const importJson = JSON.parse(importedGame) as GameSaveFile;
      dispatch(loadGameFromSave({ state: importJson.data }));
      // this starts the game immediately
      dispatch(setInit({ init: true }));
    } catch (err) {
      dispatch(
        setSnackbar({
          message:
            "game import failed, are you sure the clipboard has a valid game?",
          visible: true,
          duration: 10000,
        })
      );
    }
  };

  // save game
  const saveGame = async () => {
    if (!initialized) {
      return;
    }

    // https://react-native-async-storage.github.io/async-storage/docs/limits
    // on Android it's limited to 2MB per save, 6MB total
    // TODO: should fix this somehow

    try {
      let gameSaveNextId = Number(await AsyncStorage.getItem("gameSaveNextId"));
      if (!gameSaveNextId) {
        gameSaveNextId = 0;
      }

      let saves = await AsyncStorage.getItem("gameSaves");
      if (!saves) {
        saves = "[]";
      }
      const savesJson = JSON.parse(saves) as GameSaveFile[];

      const newSave: GameSaveFile = {
        id: gameSaveNextId,
        timestamp: Date.now(),
        previewText: currentTurn.text,
        gameEngineVersion: "0",
        data: { ...currentGameState, showConfig: false },
      };
      const newSaveJson = JSON.stringify([...savesJson, newSave]);
      AsyncStorage.setItem("gameSaves", newSaveJson);
      AsyncStorage.setItem("gameSaveNextId", (gameSaveNextId + 1).toString());
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  const loadGameSave = (save: GameSaveFile) => {
    dispatch(loadGameFromSave({ state: save.data }));
  };

  const deleteGameSave = async (save: GameSaveFile) => {
    try {
      const saves = await AsyncStorage.getItem("gameSaves");
      if (!saves) {
        return;
      }
      const savesJson = JSON.parse(saves) as GameSaveFile[];
      const newSavesJson = savesJson.filter((s) => s.id !== save.id);
      const newSavesJsonString = JSON.stringify(newSavesJson);
      AsyncStorage.setItem("gameSaves", newSavesJsonString);
      setRefreshSaves(true);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };

  // this is more for debug
  const convertSavefileToScriptText = () => {
    const result = [];
    for (const scene of currentGameState.scenes) {
      const turns = allTurns.filter((t) => t.sceneId === scene.id);
      const scripts = turns.map((turn) => turn.text);
      result.push({ scene: scene, scripts: scripts });
    }
    // return result;
    const resultJson = JSON.stringify(result);
    AsyncStorage.setItem("scriptText", resultJson);
  };

  // speech stuff
  const shouldSpeak = currentGameState.speech;
  const shouldPlayMusic = currentGameState.music;
  const shouldHideYoutube = currentGameState.hideYoutube;
  const shouldAuto = currentGameState.autoNextTurn;

  // ios
  React.useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
  }, []);

  // eleven labs text to speech
  const [postTextToSpeech, { data }] = usePostTextToSpeechMutation();

  const playTextToSpeech = async () => {
    // Call the API with the required arguments
    const response = await postTextToSpeech({
      voiceId: "ErXwobaYiN019PkySvjV",
      text: "Some text",
    });

    const { sound } = await Audio.Sound.createAsync({
      uri: response.data,
    });
    await sound.playAsync();
  };

  interface TextToSpeechInput {
    type: "prerecorded" | "elevenAI" | "system";
    onDone?: () => void;
    // used for prerecorded type
    prerecordedType?: "local" | "remote";
    prerecordedUri?: string;
    // used for eleven and system types
    text?: string;
    voiceId?: string;
  }

  // in order of preference
  // prerecorded > eleven > system
  class TextToSpeech {
    current: any;
    currentInput: TextToSpeechInput | null;
    start = async (input: TextToSpeechInput) => {
      // should trigger stop first, to stop the previous text to speech
      if (this.current) {
        this.stop();
        this.current.unloadAsync();
      }
      const newSound = new Audio.Sound();
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          if (input.onDone) {
            input.onDone();
          }
          this.currentInput = null;
        }
      });
      this.current = newSound;

      this.currentInput = input;
      switch (input.type) {
        case "prerecorded":
          let speechSource;
          if (input.prerecordedType === "local") {
            speechSource = input.prerecordedUri;
          } else if (input.prerecordedType === "remote") {
            speechSource = { uri: input.prerecordedUri };
          }
          this.current.loadAsync(speechSource, { shouldPlay: true });
          break;

        case "elevenAI":
          const response = await postTextToSpeech({
            voiceId: input.voiceId,
            text: input.text,
          });
          this.current.loadAsync({ uri: response.data }, { shouldPlay: true });
          break;

        case "system":
          // this is because on chrome, it cuts off somewhere around 200 characters
          const maxLength = Math.min(Speech.maxSpeechInputLength, 200);
          const cutString = (inputString: string) => {
            const sentences = inputString.match(/[^,.!?]+[,.!?]+/g) || [];
            const result: string[] = [];
            let currentParagraph = "";
            sentences.forEach((sentence) => {
              if (currentParagraph.length + sentence.length <= maxLength) {
                currentParagraph += sentence;
              } else {
                result.push(currentParagraph);
                currentParagraph = sentence;
              }
            });
            if (currentParagraph) {
              result.push(currentParagraph);
            }
            return result;
          };

          if (input.text.length > maxLength) {
            const lines = cutString(input.text);
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              Speech.speak(line, {
                voice: input.voiceId,
                onDone: () => {
                  if (i < lines.length - 1) {
                    // do nothing
                  } else {
                    if (input.onDone) {
                      input.onDone();
                    }
                    this.currentInput = null;
                  }
                },
              });
            }
          } else {
            Speech.speak(input.text, {
              voice: input.voiceId,
              onDone: () => {
                if (input.onDone) {
                  input.onDone();
                }
                this.currentInput = null;
              },
            });
          }
          break;
      }
    };
    // stop shouldn't trigger onDone
    stop = () => {
      if (this.currentInput) {
        switch (this.currentInput.type) {
          case "prerecorded":
            if (this.current) {
              this.current.stopAsync();
              // this.current.unloadAsync();
            }
            break;
          case "elevenAI":
            if (this.current) {
              this.current.stopAsync();
              // this.current.unloadAsync();
            }
            break;
          case "system":
            Speech.stop();
            break;
        }
        this.current = null;
      }
    };

    unload = () => {
      if (this.current) {
        this.current.unloadAsync();
      }
    };
  }

  const [currentTextToSpeech, setCurrentTextToSpeech] = React.useState(
    new TextToSpeech()
  );

  const onContinue = () => {
    if (!currentGameState.showConfig) {
      currentTextToSpeech.stop();
      dispatch(nextTurn({}));
    }
  };

  const elevenKey = useAppSelector((state) => state.systemSettings.elevenKey);

  const onDoneSpeech = () => {
    if (shouldAuto) {
      onContinue();
    }
  };

  React.useEffect(() => {
    if (shouldSpeak) {
      if (currentTurn) {
        if (currentGameState.speechPrerecorded) {
          // check if there is prerecorded speech
          currentTextToSpeech.start({
            type: "prerecorded",
            onDone: onDoneSpeech,
            prerecordedType: "remote",
            prerecordedUri: `${currentGameState.speechPrerecordedUrl}/${currentTurnId}.mp3`,
          });
        } else {
          // removes everything in brackets for speech
          const line = currentTurnText.replace(/[\[({].*?[\])}]/g, "");

          let defaultVoiceIdentifier = "";
          let useEleven = elevenKey && elevenKey !== "undefined";
          if (useEleven) {
            defaultVoiceIdentifier = "EXAVITQu4vr4xnSDxMaL";
          } else {
            defaultVoiceIdentifier = "Google US English";
          }
          const speakerName = currentTurn.activePortrait;
          if (speakerName) {
            const character = currentGameState.characters.find(
              (c) => c.name === speakerName
            );
            if (character) {
              if (character.voice) {
                useEleven = character.voice.type === "elevenAI";
                defaultVoiceIdentifier = character.voice.voiceId;
              }
            }
          }
          currentTextToSpeech.start({
            type: useEleven ? "elevenAI" : "system",
            onDone: onDoneSpeech,
            text: line,
            voiceId: defaultVoiceIdentifier,
          });
        }
      }
    }
  }, [shouldSpeak, currentTurnText]);

  const [autoAdvanceTimer, setAutoAdvanceTimer] =
    React.useState<NodeJS.Timeout | null>(null);

  // auto advance
  React.useEffect(() => {
    console.log(
      "auto advance useEffect, shouldAuto: " +
        shouldAuto +
        ", shouldSpeak: " +
        shouldSpeak +
        ", currentGameState.showConfig: " +
        currentGameState.showConfig
    );
    if (shouldAuto) {
      if (!shouldSpeak) {
        // this is used when speech is not on, but auto is on
        setAutoAdvanceTimer(
          setInterval(() => {
            onContinue();
          }, 3000)
        );
      } else {
        clearInterval(autoAdvanceTimer);
        // if speech is on
        // check if the speech is ongoing
        if (currentTextToSpeech.currentInput) {
          if (
            currentTextToSpeech.currentInput.type == "prerecorded" ||
            currentTextToSpeech.currentInput.type == "elevenAI"
          ) {
            if (currentTextToSpeech.current) {
              // if speech is prerecorded, then wait for it to finish
              currentTextToSpeech.current.setOnPlaybackStatusUpdate(
                (status) => {
                  if (status.didJustFinish) {
                    onContinue();
                  }
                }
              );
            }
          } else if (currentTextToSpeech.currentInput.type == "system") {
            // this adds a space to the speech queue, then onContinue will be called
            Speech.speak(" ", {
              onDone: onContinue,
            });
          }
        } else {
          // if speech is already done, then continue
          onContinue();
        }
      }
    } else {
      clearInterval(autoAdvanceTimer);
    }
    return () => clearInterval(autoAdvanceTimer);
  }, [shouldSpeak, shouldAuto, currentGameState.showConfig]);

  // background music

  const [backgroundMusic, setBackgroundMusic] = React.useState<Audio.Sound>();

  const playBackgroundMusic = async (music: VisualNovelGameMusic | null) => {
    if (shouldPlayMusic) {
      if (music) {
        let musicSource;
        if (music.type == "youtube") {
          // this is a special case, handled by the youtube player
          return;
        } else if (music.type == "local") {
          // musicSource = require("./../../public/musics/0.mp3");
          musicSource = music.uri;
        } else if (music.type == "remote") {
          musicSource = { uri: music.uri };
        }
        const { sound } = await Audio.Sound.createAsync(musicSource, {
          isLooping: music.loop,
        });
        setBackgroundMusic(sound);
        await sound.playAsync();
      } else {
        if (backgroundMusic) {
          await backgroundMusic.stopAsync();
        }
      }
    } else {
      if (backgroundMusic) {
        await backgroundMusic.stopAsync();
      }
    }
  };

  React.useEffect(() => {
    return backgroundMusic
      ? () => {
          backgroundMusic.unloadAsync();
        }
      : undefined;
  }, [backgroundMusic]);

  React.useEffect(() => {
    playBackgroundMusic(currentMusic);
  }, [currentMusic, shouldPlayMusic]);

  // youtube music

  const youtubeMusicOverlay = React.useMemo(() => {
    if (shouldPlayMusic) {
      if (currentMusic) {
        if (currentMusic.type == "youtube") {
          return (
            <GameYoutubePlayer
              videoId={currentMusic.uri}
              hidden={shouldHideYoutube}
            />
          );
        }
      }
    }
    return <></>;
  }, [currentMusic, shouldPlayMusic, shouldHideYoutube]);

  // automatically generate more scripts and scenes

  const autoGenerate = currentGameState.autoGenerate;

  const generatorBusy = useAppSelector(
    (state) => state.gameMaker.generatorBusy
  );

  React.useEffect(() => {
    const turnBuffer = 100;
    const sceneBuffer = 6;
    if (autoGenerate) {
      if (!generatorBusy) {
        if (currentGameState.scenes.length - 1 > currentSceneId + 1) {
          if (allTurns.length - 1 - currentTurnId < turnBuffer) {
            console.log("auto generating more script");
            generateMoreScript();
          }
        }
        if (currentGameState.scenes.length - 1 - currentSceneId < sceneBuffer) {
          console.log("auto generating more scenes");
          generateMoreScenes();
        }
      }
    }
  }, [currentTurnId, autoGenerate, generatorBusy]);

  // debug menu

  const [voiceTestMenu, setVoiceTestMenu] = React.useState(false);
  const [voices, setVoices] = React.useState<Speech.Voice[]>([]);

  React.useEffect(() => {
    Speech.getAvailableVoicesAsync().then((voices) => {
      setVoices(voices);
    });
  }, []);

  const debugMenu = {
    text: `Turn: ${currentTurnId}/${
      allTurns.length - 1
    } | Scene: ${currentSceneId}/${currentGameState.scenes.length - 1}`,
    buttons: [
      {
        name: "Test Text to Speech (prerecorded, remote)",
        onPress: () => {
          currentTextToSpeech.start({
            type: "prerecorded",
            onDone: () => {
              console.log("Test Text to Speech (prerecorded, remote) done");
            },
            prerecordedType: "remote",
            prerecordedUri: "https://download.samplelib.com/mp3/sample-3s.mp3",
          });
        },
      },
      {
        name: "Test Text to Speech (eleven)",
        onPress: () => {
          currentTextToSpeech.start({
            type: "elevenAI",
            onDone: () => {
              console.log("Test Text to Speech (eleven) done");
            },
            text: "Test Text to Speech (eleven)",
            voiceId: "ErXwobaYiN019PkySvjV",
          });
        },
      },
      {
        name: "Test Text to Speech (system)",
        onPress: () => {
          currentTextToSpeech.start({
            type: "system",
            onDone: () => {
              console.log("Test Text to Speech (system) done");
            },
            text: "Test Text to Speech (system)",
            voiceId: "Google US English",
          });
        },
      },
      {
        name: "Test Text to Speech - STOP",
        onPress: () => {
          currentTextToSpeech.stop();
        },
      },
      {
        name: "Test elevenlabs text to speech",
        onPress: playTextToSpeech,
      },
      {
        name: "Voice Test Menu",
        onPress: () => setVoiceTestMenu(!voiceTestMenu),
      },
      {
        name: "Generate More Turns",
        onPress: generateMoreScript,
      },
      {
        name: "Generate More Scenes",
        onPress: generateMoreScenes,
      },
      {
        name: "Reset",
        onPress: () => {
          dispatch(resetGamePlayerState({}));
          dispatch(loadGameFromSave({ state: props.game.data }));
        },
      },
      {
        name: "Get Script Text",
        onPress: () => {
          convertSavefileToScriptText();
        },
      },
    ],
  };

  // end debug menu

  // onClose stuff
  const onClose = () => {
    currentTextToSpeech.unload();
    // background music is self unloading
    // TODO? Fully reset???
    dispatch(resetGamePlayerState({}));
  };

  React.useEffect(() => {
    return () => {
      onClose();
    };
  }, []);

  //

  const [refreshSaves, setRefreshSaves] = React.useState(true);

  const reloadSaveFiles = () => {
    AsyncStorage.getItem("gameSaves").then((saves) => {
      if (!saves) {
        saves = "[]";
      }
      const savesJson = JSON.parse(saves) as GameSaveFile[];
      setCurrentSavedGames(savesJson.sort((a, b) => b.timestamp - a.timestamp));
    });
  };

  React.useEffect(() => {
    if (currentGameState.showLoadSave || refreshSaves) {
      reloadSaveFiles();
      setRefreshSaves(false);
    }
  }, [currentGameState.showLoadSave, refreshSaves]);

  // Disable auto on iOS web due to safari limitations
  const [shouldShowAuto, setShouldShowAuto] = React.useState(true);

  React.useEffect(() => {
    if (Platform.OS === "web") {
      Constants.getWebViewUserAgentAsync().then((ua) => {
        if (ua.includes("iPad") || ua.includes("iPhone")) {
          setShouldShowAuto(false);
        }
      });
    }
  }, []);

  //

  const textSize = currentGameState.textSize ?? 16;

  const MenuOverlay = () => {
    if (currentGameState.showLoadSave) {
      const gameLoadSaveMenu = (
        <GameLoadMenu
          background={currentBackground}
          saves={currentSavedGames}
          onLoadPressed={(save) => loadGameSave(save)}
          onDeletePressed={(save) => deleteGameSave(save)}
          onBackPressed={() =>
            dispatch(setShowLoadSave({ showLoadSave: false }))
          }
        />
      );
      return gameLoadSaveMenu;
    }

    if (currentGameState.showHistory) {
      const gameScriptHistory = (
        <GameScriptHistory
          background={currentBackground}
          turns={allTurns.filter((turn) => turn.id <= currentTurnId)}
          onBackPressed={() => dispatch(setShowHistory({ showHistory: false }))}
        />
      );
      return gameScriptHistory;
    }

    if (currentGameState.showCredits) {
      const gameCredits = (
        <GameCredits
          background={currentBackground}
          onBackPressed={() => dispatch(setShowCredits({ showCredits: false }))}
          creditTexts={[{ text: "i haven't gotten around to the credits yet" }]}
        />
      );
      return gameCredits;
    }

    if (currentGameState.showConfig) {
      const gameConfigMenu = (
        <GameConfigMenu
          background={currentBackground}
          fullscreen={props.task.fullscreened}
          onFullscreenPressed={
            props.task.fullscreened
              ? () => dispatch(exitFullscreenTask({ id: props.task.id }))
              : () => dispatch(fullscreenTask({ id: props.task.id }))
          }
          autoGengerate={autoGenerate}
          onAutoGeneratePressed={() =>
            dispatch(setAutoGenerate({ autoGenerate: !autoGenerate }))
          }
          shouldShowAuto={shouldShowAuto}
          auto={shouldAuto}
          onAutoPressed={() =>
            dispatch(setAutoNextTurn({ autoNextTurn: !shouldAuto }))
          }
          onTextBiggerPressed={() =>
            dispatch(setTextSize({ textSize: textSize + 2 }))
          }
          onTextSmallerPressed={() =>
            dispatch(setTextSize({ textSize: textSize - 2 }))
          }
          speech={shouldSpeak}
          onSpeechPressed={() => dispatch(setSpeech({ speech: !shouldSpeak }))}
          music={shouldPlayMusic}
          onMusicPressed={() => dispatch(setMusic({ music: !shouldPlayMusic }))}
          hideYoutube={shouldHideYoutube}
          onHideYoutubePressed={() =>
            dispatch(setHideYoutube({ hideYoutube: !shouldHideYoutube }))
          }
          onHistoryPressed={() =>
            dispatch(setShowHistory({ showHistory: true }))
          }
          onExportPressed={exportGame}
          onExportToServerPressed={exportGameToServer}
          onSavePressed={saveGame}
          onLoadPressed={() =>
            dispatch(setShowLoadSave({ showLoadSave: true }))
          }
          onCreditsPressed={() =>
            dispatch(setShowCredits({ showCredits: true }))
          }
          onReturnToTitlePressed={() => {
            // do a quick save
            saveGame();
            currentTextToSpeech.stop();
            dispatch(resetGamePlayerState({}));
            dispatch(loadGameFromSave({ state: props.game.data }));
          }}
          onBackPressed={() => dispatch(setConfig({ showConfig: false }))}
          showShortMenu={!initialized}
          textSize={textSize}
        />
      );
      return gameConfigMenu;
    }

    if (voiceTestMenu) {
      const line =
        "Well, it's complicated. You could say that I'm gay... or nonbinary. Actually, I kind of identify as a catgirl.";
      return (
        <GameDebugVoiceTestMenu
          background={currentBackground}
          onBackPressed={() => setVoiceTestMenu(false)}
          voices={voices}
          onVoicePressed={(voice) => {
            Speech.stop();
            Speech.speak(line, {
              voice: voices[voice].identifier,
            });
          }}
        />
      );
    }

    if (!initialized) {
      return (
        <GameStartMenu
          background={props.game.data.titleBackground}
          onResumePressed={() => {
            loadGameSave(currentSavedGames[0]);
          }}
          onStartPressed={() => {
            // BUG: first turn has an empty currentCharacters
            dispatch(loadGameFromSave({ state: props.game.data }));
            dispatch(setInit({ init: true }));
          }}
          onLoadPressed={() =>
            dispatch(setShowLoadSave({ showLoadSave: true }))
          }
          onImportPressed={importGame}
          onSettingsPressed={() => dispatch(setConfig({ showConfig: true }))}
          onCreditsPressed={() =>
            dispatch(setShowCredits({ showCredits: true }))
          }
          onExitPressed={() => {
            if (props.task.fullscreened) {
              dispatch(exitFullscreenTask({ id: props.task.id }));
            }
            dispatch(closeTask({ id: props.task.id }));
          }}
          showResumeButton={
            props.game.newGame ? false : currentSavedGames.length > 0
          }
        />
      );
    }

    return <></>;
  };

  return (
    <>
      <VisualNovelGame
        background={currentBackground}
        portraits={currentPortraits}
        activePortraitName={currentActivePortraitName}
        textBox={{ text: currentTurnText, textStyle: { fontSize: textSize } }}
        choiceButtons={[]}
        configButton={{
          onPress: () => {
            dispatch(setConfig({ showConfig: true }));
          },
        }}
        onContinue={onContinue}
        debug={debugStatus}
        debugMenu={debugMenu}
      />
      {youtubeMusicOverlay}
      <MenuOverlay />
    </>
  );
}
