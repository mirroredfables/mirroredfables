import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DesktopBackgroundProps } from "../molecules/Desktop/DesktopBackground";
import { defaultDesktopBackground } from "../molecules/Desktop/DesktopBackground.stories";
import { SystemSnackbarProps } from "../organisms/SystemSnackbar";
import { ConfigureGptForm, GptModel } from "./ChatgptSlice";

import type { RootState } from "./Store";

export const restoreConfig = createAsyncThunk(
  "systemSettings/restoreConfig",
  async () => {
    const theme = await AsyncStorage.getItem("theme");
    const desktopBackground = await AsyncStorage.getItem("desktopBackground");
    const openAiKey = await AsyncStorage.getItem("openAiKey");
    const openAiGptModel = await AsyncStorage.getItem("openAiGptModel");
    const elevenKey = await AsyncStorage.getItem("elevenKey");
    const debug = await AsyncStorage.getItem("debug");
    const localServer = await AsyncStorage.getItem("localServer");
    const useProxy = await AsyncStorage.getItem("useProxy");
    const proxyKey = await AsyncStorage.getItem("proxyKey");
    return {
      theme: theme,
      desktopBackground: desktopBackground,
      openAiKey: openAiKey,
      openAiGptModel: openAiGptModel,
      elevenKey: elevenKey,
      debug: debug,
      localServer: localServer,
      useProxy: useProxy,
      proxyKey: proxyKey,
    };
  }
);

export const saveLocalServer = createAsyncThunk(
  "systemSettings/saveLocalServer",
  async (payload: { localServer: string }) => {
    await AsyncStorage.setItem("localServer", payload.localServer);
    return payload;
  }
);

export const saveTheme = createAsyncThunk(
  "systemSettings/saveTheme",
  async (payload: { theme: string }) => {
    await AsyncStorage.setItem("theme", payload.theme);
    return payload;
  }
);

export const saveDesktopBackground = createAsyncThunk(
  "systemSettings/saveDesktopBackground",
  async (payload: DesktopBackgroundProps) => {
    await AsyncStorage.setItem("desktopBackground", JSON.stringify(payload));
    return payload;
  }
);

export const saveConfigChatgpt = createAsyncThunk(
  "systemSettings/saveConfigChatgpt",
  async (payload: ConfigureGptForm) => {
    await AsyncStorage.setItem("openAiKey", payload.key);
    await AsyncStorage.setItem("openAiGptModel", payload.model);
    return payload;
  }
);

interface ConfigureElevenForm {
  elevenKey: string;
}

export const saveConfigElevenLabs = createAsyncThunk(
  "systemSettings/saveConfigElevenLabs",
  async (payload: ConfigureElevenForm) => {
    await AsyncStorage.setItem("elevenKey", payload.elevenKey);
    return payload;
  }
);

export const saveConfigProxy = createAsyncThunk(
  "systemSettings/saveConfigProxy",
  async (payload: { useProxy: boolean; proxyKey: string }) => {
    await AsyncStorage.setItem("useProxy", payload.useProxy.toString());
    await AsyncStorage.setItem("proxyKey", payload.proxyKey);
    return payload;
  }
);

interface SystemSettingsState {
  debug: boolean;
  localServer: boolean;
  restored: boolean;
  theme: string;
  desktopBackground: DesktopBackgroundProps;
  snackbar: SystemSnackbarProps;

  // chatgpt
  openAiKey: string;
  openAiGptModel: GptModel;

  // eleven voice
  elevenKey: string;

  // proxy
  useProxy: boolean;
  proxyKey: string;
}

const initialState: SystemSettingsState = {
  debug: false,
  localServer: false,
  restored: false,
  theme: "marine",
  desktopBackground: defaultDesktopBackground,
  snackbar: {
    message: "Hello World",
    visible: false,
  },
  openAiKey: "",
  openAiGptModel: GptModel.GPT4,
  elevenKey: "",
  useProxy: false,
  proxyKey: "",
};

export const systemSettingsSlice = createSlice({
  name: "systemSettings",
  initialState: initialState,
  reducers: {
    setDebug: (state, action: PayloadAction<{ debug: boolean }>) => {
      state.debug = action.payload.debug;
      return state;
    },
    setLocalServer: (
      state,
      action: PayloadAction<{ localServer: boolean }>
    ) => {
      state.localServer = action.payload.localServer;
      return state;
    },
    setTheme: (state, action: PayloadAction<{ theme: string }>) => {
      state.theme = action.payload.theme;
      return state;
    },
    setDesktopBackground: (
      state,
      action: PayloadAction<DesktopBackgroundProps>
    ) => {
      state.desktopBackground = action.payload;
      return state;
    },
    setSnackbar: (state, action: PayloadAction<SystemSnackbarProps>) => {
      state.snackbar = action.payload;
      return state;
    },
    dismissSnackbar: (state, action: PayloadAction<{}>) => {
      state.snackbar.visible = false;
      return state;
    },
    configureChatgpt: (state, action: PayloadAction<ConfigureGptForm>) => {
      state.openAiKey = action.payload.key;
      state.openAiGptModel = action.payload.model;
      return state;
    },
    configureElevenLabs: (
      state,
      action: PayloadAction<ConfigureElevenForm>
    ) => {
      state.elevenKey = action.payload.elevenKey;
      return state;
    },
    configureProxy: (
      state,
      action: PayloadAction<{ useProxy: boolean; proxyKey: string }>
    ) => {
      state.useProxy = action.payload.useProxy;
      state.proxyKey = action.payload.proxyKey;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(restoreConfig.fulfilled, (state, action) => {
      if (action.payload.theme) {
        state.theme = action.payload.theme;
      }
      if (action.payload.desktopBackground) {
        state.desktopBackground = JSON.parse(
          action.payload.desktopBackground
        ) as DesktopBackgroundProps;
      }
      if (action.payload.openAiKey) {
        state.openAiKey = action.payload.openAiKey;
      }
      if (action.payload.openAiGptModel) {
        state.openAiGptModel = action.payload.openAiGptModel as GptModel;
      }
      if (action.payload.elevenKey) {
        state.elevenKey = action.payload.elevenKey;
      }
      if (action.payload.debug) {
        state.debug = action.payload.debug === "true";
      }
      if (action.payload.localServer) {
        state.localServer = action.payload.localServer === "true";
      }
      if (action.payload.useProxy) {
        state.useProxy = action.payload.useProxy === "true";
      }
      if (action.payload.proxyKey) {
        state.proxyKey = action.payload.proxyKey;
      }
      state.restored = true;
    });
  },
});

export const {
  setDebug,
  setLocalServer,
  setTheme,
  setDesktopBackground,
  setSnackbar,
  dismissSnackbar,
  configureChatgpt,
  configureElevenLabs,
  configureProxy,
} = systemSettingsSlice.actions;

export default systemSettingsSlice.reducer;
