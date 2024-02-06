// Home Screen for the App

import * as React from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import { Provider as React95Provider, themes } from "react95-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import {
  newTask,
  activateTask,
  closeTask,
  maximizeTask,
  minimizeTask,
  restoreTask,
  resizeTask,
  tasksSelectors,
  moveTask,
  fullscreenTask,
  exitFullscreenTask,
  Task,
} from "../redux/TasksSlice";
import {
  setTheme,
  saveTheme,
  setDesktopBackground,
  dismissSnackbar,
  setSnackbar,
  restoreConfig,
  saveConfigChatgpt,
  configureChatgpt,
  saveDesktopBackground,
  setDebug,
  configureElevenLabs,
  saveConfigElevenLabs,
  saveLocalServer,
  setLocalServer,
  configureProxy,
  saveConfigProxy,
  configureImageGenerator,
  saveConfigImageGenerator,
  configureVoiceProvider,
  saveConfigVoiceProvider,
} from "../redux/SystemSettingsSlice";

import FullApp from "../templates/FullApp";
import SystemSettings from "../organisms/SystemApps/SystemSettings";
import WebBrowser from "../organisms/SystemApps/WebBrowser";
import YoutubePlayer from "../organisms/SystemApps/YoutubePlayer";
import {
  DiscordNotificationButton,
  EmailNotificationButton,
  GithubNotificationButton,
  InstagramNotificationButton,
  TikTokNotificationButton,
  TwitterNotificationButton,
} from "../molecules/Taskbar/NotificationButton.stories";
import { defaultStartMenu } from "../molecules/Taskbar/StartMenu.stories";
import Chat from "../organisms/SystemApps/Chat";
import Book from "../organisms/UserApps/Book";
import AiSettings from "../organisms/SystemApps/AiSettings";
import WelcomeWizard from "../organisms/SystemApps/WelcomeWizard";
import ErrorPopup from "../organisms/SystemApps/ErrorPopup";
import { GameSaveFile, resetGamePlayer } from "../redux/GameSlice";
import {
  addHumanMessage,
  askChatgpt,
  selectAllChatgptMessages,
  testConfigChatgpt,
  setTestElevenConfigResponse,
} from "../redux/ChatgptSlice";
import {
  addBookHumanMessage,
  askBookForFollowup,
  askBookForQuote,
  resetAllMessages,
  selectAllBookMessages,
} from "../redux/BookSlice";
import VisualNovelGameFull from "./VisualNovelGameFull";
import VisualNovelLongStory from "../../public/scripts/VisualNovelLongStory";
import VisualNovelShortStory from "../../public/scripts/VisualNovelShortStory";
import NarutoStory from "../../public/scripts/NarutoStory";
import PotterStory from "../../public/scripts/PotterStory";
import ZeldaStory from "../../public/scripts/ZeldaStory";
import WelcomeIcon from "../../public/icons/floppy.png";
import SettingsIcon from "../../public/icons/settings.png";
import KeysIcon from "./../../public/icons/keys.png";
import WarningIcon from "../../public/icons/warning.png";
import BrowserIcon from "../../public/icons/browser.png";
import ChatIcon from "../../public/icons/chat.png";
import GameIcon from "../../public/icons/game.png";
import ZeldaIcon from "../../public/icons/zelda.png";
import NarutoIcon from "../../public/icons/naruto.png";
import PotterIcon from "../../public/icons/potter.png";
import BookIcon from "../../public/icons/book.png";
import ReonaIcon from "../../public/icons/reona.png";
import { useGetTestApiKeyQuery } from "../redux/ElevenLabsSlice";
import TextToImage from "../organisms/SystemApps/TextToImage";
import { generateImage } from "../redux/ImagesSlice";
import VisualNovelGameMakerFull from "./VisualNovelGameMakerFull";
import VisualNovelGameLauncher from "../organisms/UserApps/VisualNovelGameLauncher";
import ProxySettings from "../organisms/SystemApps/ProxySettings";
import { testProxyKey } from "../redux/ProxySlice";

export default function HomeScreen() {
  const dispatch = useAppDispatch();

  const currentSystemSettings = useAppSelector((state) => state.systemSettings);
  const currentProxy = useAppSelector((state) => state.proxy);
  const debugStatus = currentSystemSettings.debug;

  React.useEffect(() => {
    if (!currentSystemSettings.restored) {
      dispatch(restoreConfig());
    }
  }, []);

  const currentAppThemeName = currentSystemSettings.theme;
  const [appTheme, setAppTheme] = React.useState(currentAppThemeName);

  React.useEffect(() => {
    if (currentAppThemeName) {
      setAppTheme(themes[currentAppThemeName]);
    }
  }, [currentAppThemeName]);

  const tasks = useAppSelector((state) =>
    tasksSelectors.selectAll(state).filter((task) => !task.closed)
  );
  const tasksStateVars = useAppSelector((state) => state.tasks);

  const welcomeWizardAppIcon =
    Platform.OS === "web"
      ? "icons/floppy.png"
      : Image.resolveAssetSource(WelcomeIcon).uri;

  const launchWelcomeWizard = () => {
    dispatch(
      newTask({
        name: "welcome_wizard.exe",
        icon: welcomeWizardAppIcon,
      })
    );
  };

  const welcomeWizardShortcut = {
    icon: welcomeWizardAppIcon,
    name: "welcome_wizard.exe",
    onPress: () => {
      console.log("welcome wizard pressed");
      launchWelcomeWizard();
    },
  };

  const errorPopupAppIcon =
    Platform.OS === "web"
      ? "icons/warning.png"
      : Image.resolveAssetSource(WarningIcon).uri;

  const launchErrorPopup = () => {
    dispatch(
      newTask({
        name: "error.exe",
        icon: errorPopupAppIcon,
        maximized: true,
      })
    );
  };

  const errorPopupShortcut = {
    icon: errorPopupAppIcon,
    name: "error.exe",
    onPress: () => {
      console.log("error popup pressed");
      launchErrorPopup();
    },
  };

  const systemSettingsAppIcon =
    Platform.OS === "web"
      ? "icons/settings.png"
      : Image.resolveAssetSource(SettingsIcon).uri;

  const systemSettingsShortcut = {
    icon: systemSettingsAppIcon,
    name: "system_settings.exe",
    onPress: () => {
      console.log("system settings pressed");
      dispatch(
        newTask({
          name: "system_settings.exe",
          icon: systemSettingsAppIcon,
        })
      );
    },
  };

  const aiSettingsAppIcon =
    Platform.OS === "web"
      ? "icons/keys.png"
      : Image.resolveAssetSource(KeysIcon).uri;

  const launchAiSettings = () => {
    dispatch(
      newTask({
        name: "ai_settings.exe",
        icon: aiSettingsAppIcon,
      })
    );
  };

  const aiSettingsShortcut = {
    icon: aiSettingsAppIcon,
    name: "ai_settings.exe",
    onPress: () => {
      console.log("ai settings pressed");
      launchAiSettings();
    },
  };

  const launchProxySettings = () => {
    dispatch(
      newTask({
        name: "proxy_settings.exe",
        icon: aiSettingsAppIcon,
      })
    );
  };

  const proxySettingsShortcut = {
    icon: aiSettingsAppIcon,
    name: "proxy_settings.exe",
    onPress: () => {
      console.log("proxy settings pressed");
      launchProxySettings();
    },
  };

  const warningIcon =
    Platform.OS === "web"
      ? "icons/warning.png"
      : Image.resolveAssetSource(WarningIcon).uri;

  const debugOnShortcut = {
    icon: warningIcon,
    name: "turn on debug",
    onPress: () => {
      console.log("turn on debug pressed");
      dispatch(
        setSnackbar({
          message: "debug mode on",
          visible: true,
          duration: 10000,
        })
      );
      dispatch(setDebug({ debug: true }));
    },
  };

  const debugOffShortcut = {
    icon: warningIcon,
    name: "turn off debug",
    onPress: () => {
      console.log("turn off debug pressed");
      // dispatch(dismissSnackbar({}));
      dispatch(
        setSnackbar({
          message: "debug mode off",
          visible: true,
          duration: 10000,
        })
      );
      dispatch(setDebug({ debug: false }));
    },
  };

  const localServerOnShortcut = {
    icon: warningIcon,
    name: "turn on use local server",
    onPress: () => {
      console.log("turn on use local server");
      dispatch(
        setSnackbar({
          message: "use local server on",
          visible: true,
          duration: 10000,
        })
      );
      dispatch(saveLocalServer({ localServer: "true" }));
      dispatch(setLocalServer({ localServer: true }));
    },
  };

  const localServerOffShortcut = {
    icon: warningIcon,
    name: "turn off use local server",
    onPress: () => {
      console.log("turn off use local server");
      dispatch(
        setSnackbar({
          message: "use local server off",
          visible: true,
          duration: 10000,
        })
      );
      dispatch(saveLocalServer({ localServer: "false" }));
      dispatch(setLocalServer({ localServer: false }));
    },
  };

  const browserAppIcon =
    Platform.OS === "web"
      ? "icons/browser.png"
      : Image.resolveAssetSource(BrowserIcon).uri;

  const browserShortcut = {
    icon: browserAppIcon,
    name: "browser.exe",
    onPress: () => {
      console.log("browser.exe pressed");
      dispatch(
        newTask({
          name: "browser.exe",
          icon: browserAppIcon,
        })
      );
    },
  };

  const youtubeShortcut = {
    icon: browserAppIcon,
    name: "youtube.exe",
    onPress: () => {
      console.log("youtube.exe pressed");
      dispatch(
        newTask({
          name: "youtube.exe",
          icon: browserAppIcon,
        })
      );
    },
  };

  const chatAppIcon =
    Platform.OS === "web"
      ? "icons/chat.png"
      : Image.resolveAssetSource(ChatIcon).uri;

  const chatShortcut = {
    icon: chatAppIcon,
    name: "chat.exe",
    onPress: () => {
      console.log("chat.exe pressed");
      if (chatMessages.length == 0) {
        dispatch(addHumanMessage({ question: "welcome to chat." }));
      }
      dispatch(
        newTask({
          name: "chat.exe",
          icon: chatAppIcon,
        })
      );
    },
  };

  const bookAppIcon =
    Platform.OS === "web"
      ? "icons/chat.png"
      : Image.resolveAssetSource(ChatIcon).uri;

  const bookShortcut = {
    icon: bookAppIcon,
    name: "book.exe",
    onPress: () => {
      console.log("book.exe pressed");
      dispatch(
        newTask({
          name: "book.exe",
          icon: bookAppIcon,
        })
      );
    },
  };

  const textToImageAppIcon =
    Platform.OS === "web"
      ? "icons/chat.png"
      : Image.resolveAssetSource(ChatIcon).uri;

  const textToImageShortcut = {
    icon: textToImageAppIcon,
    name: "text_to_image.exe",
    onPress: () => {
      console.log("text_to_image.exe pressed");
      dispatch(
        newTask({
          name: "text_to_image.exe",
          icon: textToImageAppIcon,
        })
      );
    },
  };

  const gameMakerAppIcon =
    Platform.OS === "web"
      ? "icons/chat.png"
      : Image.resolveAssetSource(ChatIcon).uri;

  const gameMakerShortcut = {
    icon: gameMakerAppIcon,
    name: "gamemaker.exe",
    onPress: () => {
      console.log("gamemaker.exe pressed");
      dispatch(
        newTask({
          name: "gamemaker.exe",
          icon: gameMakerAppIcon,
        })
      );
    },
  };

  const gameLauncherShortcut = {
    icon: gameMakerAppIcon,
    name: "gamelauncher.exe",
    onPress: () => {
      console.log("gamelauncher.exe pressed");
      dispatch(
        newTask({
          name: "gamelauncher.exe",
          icon: gameMakerAppIcon,
        })
      );
    },
  };

  const gameData = useAppSelector((state) => state.game);

  // TODO: hacky
  const gameMakerGameSave = {
    id: 0,
    name: "custom game",
    timestamp: 0,
    previewText: "none",
    gameEngineVersion: "1",
    newGame: true,
    data: gameData,
  };

  const gameIcon =
    Platform.OS === "web"
      ? "icons/game.png"
      : Image.resolveAssetSource(GameIcon).uri;

  const launchVisualNovelGame = () => {
    dispatch(
      newTask({
        name: "game_custom.exe",
        icon: gameIcon,
        fullscreened: true,
      })
    );
  };

  const newVisualNovelGameShortcut = {
    icon: gameIcon,
    name: "game_custom.exe",
    onPress: () => {
      console.log("game_custom.exe pressed");
      launchVisualNovelGame();
    },
  };

  const reonaIcon =
    Platform.OS === "web"
      ? "icons/reona.png"
      : Image.resolveAssetSource(ReonaIcon).uri;

  const launchVisualNovelGameLong = () => {
    dispatch(
      newTask({
        name: "game_long.exe",
        icon: reonaIcon,
        fullscreened: true,
      })
    );
  };

  const newVisualNovelGameLongShortcut = {
    icon: reonaIcon,
    name: "game_long.exe",
    onPress: () => {
      console.log("game_long.exe pressed");
      launchVisualNovelGameLong();
    },
  };

  const bookIcon =
    Platform.OS === "web"
      ? "icons/book.png"
      : Image.resolveAssetSource(BookIcon).uri;

  const launchVisualNovelGameShort = () => {
    dispatch(
      newTask({
        name: "game_short.exe",
        icon: bookIcon,
        fullscreened: true,
      })
    );
  };

  const newVisualNovelGameShortShortcut = {
    icon: bookIcon,
    name: "game_short.exe",
    onPress: () => {
      console.log("game_short.exe pressed");
      launchVisualNovelGameShort();
    },
  };

  const narutoIcon =
    Platform.OS === "web"
      ? "icons/naruto.png"
      : Image.resolveAssetSource(NarutoIcon).uri;

  const launchVisualNovelGameNaruto = () => {
    dispatch(
      newTask({
        name: "game_naruto.exe",
        icon: narutoIcon,
        fullscreened: true,
      })
    );
  };

  const newVisualNovelGameNarutoShortcut = {
    icon: narutoIcon,
    name: "game_naruto.exe",
    onPress: () => {
      console.log("game_naruto.exe pressed");
      launchVisualNovelGameNaruto();
    },
  };

  const potterIcon =
    Platform.OS === "web"
      ? "icons/potter.png"
      : Image.resolveAssetSource(PotterIcon).uri;

  const launchVisualNovelGamePotter = () => {
    dispatch(
      newTask({
        name: "game_potter.exe",
        icon: potterIcon,
        fullscreened: true,
      })
    );
  };

  const newVisualNovelGamePotterShortcut = {
    icon: potterIcon,
    name: "game_potter.exe",
    onPress: () => {
      console.log("game_potter.exe pressed");
      launchVisualNovelGamePotter();
    },
  };

  const zeldaIcon =
    Platform.OS === "web"
      ? "icons/zelda.png"
      : Image.resolveAssetSource(ZeldaIcon).uri;

  const launchVisualNovelGameZelda = () => {
    dispatch(
      newTask({
        name: "game_zelda.exe",
        icon: zeldaIcon,
        fullscreened: true,
      })
    );
  };

  const newVisualNovelGameZeldaShortcut = {
    icon: zeldaIcon,
    name: "game_zelda.exe",
    onPress: () => {
      console.log("game_zelda.exe pressed");
      launchVisualNovelGameZelda();
    },
  };

  const newTaskShortcut = {
    icon: "https://placekitten.com/80/80",
    name: "new task.exe",
    onPress: () => {
      console.log("new task.exe pressed");
      dispatch(
        newTask({
          name: "new task.exe",
          icon: "https://placekitten.com/80/80",
        })
      );
    },
  };

  const currentDesktopBackground = currentSystemSettings.desktopBackground;

  const desktop = {
    shortcuts: [
      welcomeWizardShortcut,
      systemSettingsShortcut,
      aiSettingsShortcut,
      proxySettingsShortcut,
      browserShortcut,
      chatShortcut,
      bookShortcut,
      textToImageShortcut,
      gameMakerShortcut,
      gameLauncherShortcut,
      newVisualNovelGameShortShortcut,
      newVisualNovelGameLongShortcut,
      newVisualNovelGameNarutoShortcut,
      newVisualNovelGamePotterShortcut,
      newVisualNovelGameZeldaShortcut,
      debugStatus ? debugOffShortcut : debugOnShortcut,
    ].concat(
      debugStatus
        ? [
            youtubeShortcut,
            // newVisualNovelGameShortcut,
            // newTaskShortcut,
            localServerOnShortcut,
            localServerOffShortcut,
            errorPopupShortcut,
          ]
        : []
    ),
    background: currentDesktopBackground,
  };

  const taskbar = {
    startMenu: defaultStartMenu,
    taskbarButtons: tasks.map((task, index) => {
      return {
        id: task.id,
        name: task.name,
        icon: task.icon,
        active: task.active,
        onPress: () => dispatch(activateTask(task)),
      };
    }),

    notificationButtons: [
      DiscordNotificationButton,
      TikTokNotificationButton,
      TwitterNotificationButton,
      InstagramNotificationButton,
      GithubNotificationButton,
      EmailNotificationButton,
    ],

    hidden: tasksStateVars.taskbarHidden,
  };

  const WelcomeWizardApp = () => {
    return (
      <WelcomeWizard
        buttons={[
          {
            name: "create your own story (openai key required)",
            onPress: () => {
              AsyncStorage.setItem("welcomed", "true");
              launchAiSettings();
            },
          },
          {
            name: "try an original short story (5 minutes)",
            onPress: () => {
              AsyncStorage.setItem("welcomed", "true");
              launchVisualNovelGameShort();
            },
          },
          {
            name: "try an original long story (3 hours)",
            onPress: () => {
              AsyncStorage.setItem("welcomed", "true");
              launchVisualNovelGameLong();
            },
          },
          {
            name: "try an zelda fanfic by shakespeare (30 minutes)",
            onPress: () => {
              AsyncStorage.setItem("welcomed", "true");
              launchVisualNovelGameZelda();
            },
          },
          {
            name: "try an naruto fanfic by wilde (30 minutes)",
            onPress: () => {
              AsyncStorage.setItem("welcomed", "true");
              launchVisualNovelGameNaruto();
            },
          },
          {
            name: "try an harry potter fanfic by dickens (30 minutes)",
            onPress: () => {
              AsyncStorage.setItem("welcomed", "true");
              launchVisualNovelGamePotter();
            },
          },
        ]}
      />
    );
  };

  const ErrorApp = () => {
    return <ErrorPopup />;
  };

  const SystemSettingsApp = () => {
    return (
      <SystemSettings
        currentTheme={currentAppThemeName}
        setTheme={(theme) => {
          dispatch(setTheme({ theme: theme }));
          dispatch(saveTheme({ theme: theme }));
        }}
        currentBackground={currentDesktopBackground}
        setBackground={(background) => {
          dispatch(setDesktopBackground(background));
          dispatch(saveDesktopBackground(background));
        }}
      />
    );
  };

  const chatgptStateVars = useAppSelector((state) => state.chatgpt);

  const AiSettingsApp = () => {
    return (
      <AiSettings
        openAiKey={currentSystemSettings.openAiKey}
        openAiGptModel={currentSystemSettings.openAiGptModel}
        voiceProvider={currentSystemSettings.voiceProvider}
        azureVoiceKey={currentSystemSettings.azureVoiceKey}
        elevenKey={currentSystemSettings.elevenKey}
        testOpenAiKey={(config) => dispatch(testConfigChatgpt(config))}
        testOpenAiResponse={chatgptStateVars.testConfigResponse}
        testElevenKey={(config) => {
          // // const { data: result } = useGetTestApiKeyQuery(config);
          // const result = useGetTestApiKeyQuery(config);
          // // console.log(getTestApiKey);
          // // console.log(data);
          // // const [getTestElevenApiKey, { data }] = useGetTestApiKeyQuery();
          // useGetTestApiKeyQuery(config).then((response) => {
          //   console.log(response.data);
          //   dispatch(setTestElevenConfigResponse(response.data));
          // });
        }}
        testElevenResponse={chatgptStateVars.testElevenConfigResponse}
        imageGenerator={currentSystemSettings.imageGenerator}
        stabilityKey={currentSystemSettings.stabilityKey}
        // configureAi={(config) => {
        //   dispatch(configureChatgpt(config));
        //   dispatch(saveConfigChatgpt(config));
        //   dispatch(configureVoiceProvider(config));
        //   dispatch(saveConfigVoiceProvider(config));
        //   dispatch(configureImageGenerator(config));
        //   dispatch(saveConfigImageGenerator(config));
        // }}
        configureLLMProvider={(config) => {
          dispatch(configureChatgpt(config));
          dispatch(saveConfigChatgpt(config));
        }}
        configureImageProvider={(config) => {
          dispatch(configureImageGenerator(config));
          dispatch(saveConfigImageGenerator(config));
        }}
        configureVoiceProvider={(config) => {
          dispatch(configureVoiceProvider(config));
          dispatch(saveConfigVoiceProvider(config));
        }}
        lauchGameMaker={() => {
          dispatch(
            newTask({
              name: "gamemaker.exe",
              icon: gameMakerAppIcon,
            })
          );
        }}
      />
    );
  };

  const ProxySettingsApp = () => {
    return (
      <ProxySettings
        useProxy={currentSystemSettings.useProxy}
        proxyKey={currentSystemSettings.proxyKey}
        testProxyKey={(config) => dispatch(testProxyKey(config))}
        testProxyKeyResponse={currentProxy.testProxyKeyResponse}
        configureProxy={(config: { useProxy: boolean; proxyKey: string }) => {
          dispatch(configureProxy(config));
          dispatch(saveConfigProxy(config));
        }}
      />
    );
  };

  const WebBrowserApp = () => {
    return <WebBrowser url={"https://bing.com"} />;
  };

  const YoutubePlayerApp = (props: { task: Task }) => {
    const calculatePlayerHeight = (width) => Math.ceil((width / 16) * 9);
    const calculatePlayerWidth = (height) => Math.ceil((height / 9) * 16);
    let playerWidth = props.task.width - 16 - 16;
    let playerHeight = calculatePlayerHeight(playerWidth);

    if (playerHeight > props.task.height - 16 - 16 - 32) {
      playerHeight = props.task.height - 16 - 16 - 36;
      playerWidth = calculatePlayerWidth(playerHeight);
    }

    if (props.task.fullscreened) {
      playerWidth = Dimensions.get("window").width - 16;
      playerHeight = calculatePlayerHeight(playerWidth);
      if (playerHeight > Dimensions.get("window").height - 16) {
        playerHeight = Dimensions.get("window").height - 16;
        playerWidth = calculatePlayerWidth(playerHeight);
      }
    } else if (props.task.maximized) {
      playerWidth = Dimensions.get("window").width - 16 - 16;
      playerHeight = calculatePlayerHeight(playerWidth);
      if (playerHeight > Dimensions.get("window").height - 16 - 16 - 36 - 56) {
        playerHeight = Dimensions.get("window").height - 16 - 16 - 36 - 56;
        playerWidth = calculatePlayerWidth(playerHeight);
      }
    }

    return (
      <YoutubePlayer
        videoId={"9bZkp7q19f0"}
        // playlist={"9bZkp7q19f0,M7lc1UVf-VE"}
        width={playerWidth}
        height={playerHeight}
        autoplay={true}
        loop={true}
      />
    );
  };

  const chatMessages = useAppSelector((state) =>
    selectAllChatgptMessages(state)
  );

  const ChatApp = () => {
    return (
      <Chat
        messages={chatMessages.map((message) => {
          return `[${message.role}] ${message.content}`;
        })}
        sendMessage={(message) => {
          dispatch(addHumanMessage({ question: message }));
          // Speech.speak(message, {
          //   voice: "com.apple.speech.synthesis.voice.Princess",
          // });
          // Speech.getAvailableVoicesAsync().then((response) => {
          //   console.log(response);
          // });
          dispatch(askChatgpt({ question: message }));
        }}
      />
    );
  };

  const bookMessage = useAppSelector((state) => selectAllBookMessages(state));

  const BookApp = () => {
    return (
      <Book
        messages={bookMessage.map((message) => {
          return `[${message.role}] ${message.content}`;
        })}
        sendMessage={(message) => {
          if (bookMessage.length == 0) {
            dispatch(askBookForQuote({ inputString: message }));
          } else {
            dispatch(askBookForFollowup({ inputString: message }));
          }
          dispatch(addBookHumanMessage({ input: message }));
        }}
        reset={() => {
          dispatch(resetAllMessages({}));
        }}
      />
    );
  };

  const currentImage = useAppSelector((state) => state.images.currentImage);

  const TextToImageApp = () => {
    return (
      <TextToImage
        generateImage={(input) => {
          dispatch(generateImage(input));
        }}
        generatedImage={currentImage}
      />
    );
  };

  const VisualNovelGameMakerApp = () => {
    return <VisualNovelGameMakerFull debug={debugStatus} />;
  };

  const [launcherGameSave, setLauncherGameSave] =
    React.useState<GameSaveFile | null>(null);

  const launchGameFromUrl = (gameSaveUrl: string) => {
    fetch(gameSaveUrl)
      .then((response) => response.json())
      .then((json) => {
        const gameSaveFile: GameSaveFile = json;
        setLauncherGameSave(gameSaveFile);
        dispatch(
          newTask({
            name: "game_custom_from_url.exe",
            icon: gameIcon,
          })
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const VisualNovelLauncherApp = () => {
    return <VisualNovelGameLauncher onLaunchGameFromUrl={launchGameFromUrl} />;
  };

  const VisualNovelGameApp = (props: { task: Task; game: GameSaveFile }) => {
    return <VisualNovelGameFull task={props.task} game={props.game} />;
  };

  const windows = tasks.map((task, index) => {
    const getChildren = () => {
      if (task.name == "welcome_wizard.exe") {
        return WelcomeWizardApp();
      } else if (task.name == "error.exe") {
        return ErrorApp();
      } else if (task.name == "system_settings.exe") {
        return SystemSettingsApp();
      } else if (task.name == "ai_settings.exe") {
        return AiSettingsApp();
      } else if (task.name == "proxy_settings.exe") {
        return ProxySettingsApp();
      } else if (task.name == "browser.exe") {
        return WebBrowserApp();
      } else if (task.name == "youtube.exe") {
        return YoutubePlayerApp({ task: task });
      } else if (task.name == "chat.exe") {
        return ChatApp();
      } else if (task.name == "book.exe") {
        return BookApp();
      } else if (task.name == "text_to_image.exe") {
        return TextToImageApp();
      } else if (task.name == "gamemaker.exe") {
        return VisualNovelGameMakerApp();
      } else if (task.name == "gamelauncher.exe") {
        return VisualNovelLauncherApp();
      } else if (task.name == "game_custom.exe") {
        return VisualNovelGameApp({ task: task, game: gameMakerGameSave });
      } else if (task.name == "game_custom_from_url.exe") {
        return VisualNovelGameApp({ task: task, game: launcherGameSave });
      } else if (task.name == "game_short.exe") {
        return VisualNovelGameApp({ task: task, game: VisualNovelShortStory });
      } else if (task.name == "game_long.exe") {
        return VisualNovelGameApp({ task: task, game: VisualNovelLongStory });
      } else if (task.name == "game_naruto.exe") {
        return VisualNovelGameApp({ task: task, game: NarutoStory });
      } else if (task.name == "game_potter.exe") {
        return VisualNovelGameApp({ task: task, game: PotterStory });
      } else if (task.name == "game_zelda.exe") {
        return VisualNovelGameApp({ task: task, game: ZeldaStory });
      } else {
        return WelcomeWizardApp();
      }
    };

    return {
      name: `${task.name} (pid ${task.id})`,
      icon: "https://placekitten.com/16/16",
      children: getChildren(),
      state: task,
      manager: {
        minimize: () => {
          dispatch(minimizeTask({ id: task.id }));
        },
        maximize: () => {
          dispatch(maximizeTask({ id: task.id }));
        },
        fullscreen: () => {
          dispatch(fullscreenTask({ id: task.id }));
        },
        exitFullscreen: () => {
          dispatch(exitFullscreenTask({ id: task.id }));
        },
        hideExitFullScreenButton: task.name.startsWith("game_"),
        restore: () => {
          dispatch(restoreTask({ id: task.id }));
        },
        close: () => {
          if (task.name.startsWith("game_")) {
            dispatch(resetGamePlayer({}));
          }
          dispatch(closeTask({ id: task.id }));
        },
        resize: (width: number, height: number) => {
          dispatch(resizeTask({ id: task.id, width: width, height: height }));
        },
        move: (x: number, y: number) => {
          dispatch(moveTask({ id: task.id, positionX: x, positionY: y }));
        },
        activate: () => {
          dispatch(activateTask({ id: task.id }));
        },
      },
    };
  });

  const currentSnackbar = {
    ...currentSystemSettings.snackbar,
    onDismiss: () => dispatch(dismissSnackbar({})),
  };

  // launch game if game save is provided
  // web only
  React.useEffect(() => {
    if (Platform.OS === "web") {
      const urlParams = new URLSearchParams(window.location.search);

      // example: http://localhost:19000/?proxyKey=xyz
      const proxyKey = urlParams.get("proxyKey");
      if (proxyKey) {
        const config = {
          useProxy: true,
          proxyKey: proxyKey,
        };
        dispatch(configureProxy(config));
        dispatch(saveConfigProxy(config));
        // lauch game maker
        dispatch(
          newTask({
            name: "gamemaker.exe",
            icon: gameMakerAppIcon,
          })
        );
        // check proxy key is valid
        dispatch(testProxyKey(config)).then((response) => {
          if (response.meta.requestStatus != "fulfilled") {
            launchErrorPopup();
          }
        });
      }

      const book = urlParams.get("book");
      if (book == "true") {
        dispatch(
          newTask({
            name: "book.exe",
            icon: bookAppIcon,
          })
        );
      }

      // example: http://localhost:19000/?gameUuid=xyz
      const gameUuid = urlParams.get("gameUuid");
      if (gameUuid) {
        launchGameFromUrl(
          "https://usercontent.mirroredfables.com/json/" + gameUuid + ".json"
        );
      }

      // example: http://localhost:19000/?gameUrl=http://localhost:19000/scripts/ZeldaStory.json
      const gameUrl = urlParams.get("gameUrl");
      if (gameUrl) {
        launchGameFromUrl(gameUrl);
      }
    }
  }, []);

  // launch welcome wizard for first time users
  React.useEffect(() => {
    AsyncStorage.getItem("welcomed").then((value) => {
      if (value != "true") {
        AsyncStorage.getItem("useProxy").then((value) => {
          if (value != "true") {
            launchWelcomeWizard();
          }
        });
      }
    });
  }, []);

  if (!currentSystemSettings.restored) {
    return <></>;
  }

  return (
    <React95Provider theme={appTheme}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeAreaContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 80}
          >
            <FullApp
              desktop={desktop}
              taskbar={taskbar}
              windows={windows}
              systemSnackbar={currentSnackbar}
            />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
    </React95Provider>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
});
