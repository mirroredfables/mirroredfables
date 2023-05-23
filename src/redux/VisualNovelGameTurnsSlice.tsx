import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

import { client } from "./client";
import type { RootState } from "./Store";

import { defaultGameBackground } from "../atoms/UserApps/GameBackground.stories";
import {
  VisualNovelGameCharacter,
  VisualNovelGameWorld,
  VisualNovelGameScene,
  VisualNovelGameBackground,
  VisualNovelGameTurn,
} from "./VisualNovelGameTypes";

export interface VisualNovelGameState {
  // settings
  init: boolean;
  autoGenerate: boolean;
  autoNextTurn: boolean;
  textSize?: number;
  speech: boolean;
  music: boolean;
  hideYoutube: boolean;
  showConfig: boolean;
  showHistory: boolean;
  showCredits: boolean;
  showLoadSave: boolean;
  maxConcurrentCharacters: number;

  // title screen
  titleBackground: VisualNovelGameBackground;

  // world
  world: VisualNovelGameWorld;
  storySoFar: string[];
  characters: VisualNovelGameCharacter[];
  scenes: VisualNovelGameScene[];
  previousSceneScripts: string[];

  // current
  currentSceneId: number;
  currentTurnId: number;
  currentCharacters: VisualNovelGameCharacter[];

  // text to speech related stuff
  speechPrerecorded: boolean;
  speechPrerecordedUrl: string;
}

export interface GameSaveFile {
  id: number;
  timestamp: number;
  previewText: string;
  gameEngineVersion: string;
  newGame?: boolean;
  data: any;
}

const visualNovelGameTurnsAdapter = createEntityAdapter<VisualNovelGameTurn>({
  selectId: (turn) => turn.id,
  sortComparer: (a, b) => a.id - b.id,
});

const initialState = visualNovelGameTurnsAdapter.getInitialState({
  // settings
  init: false,
  autoGenerate: false,
  autoNextTurn: false,
  textSize: 16,
  speech: false,
  music: false,
  hideYoutube: false,
  showConfig: false,
  showHistory: false,
  showCredits: false,
  showLoadSave: false,
  maxConcurrentCharacters: 2,

  // title screen
  titleBackground: defaultGameBackground,

  // world
  world: {
    setting: "",
    artStyle: "",
    writingStyle: "",
  },
  storySoFar: [],
  scenes: [],
  characters: [],

  // current
  currentSceneId: 0,
  currentTurnId: 0,
  currentCharacters: [],

  //
  previousSceneScripts: [],

  //
  speechPrerecorded: false,
  speechPrerecordedUrl: "",
} as VisualNovelGameState);

export const visualNovelGameTurnsSlice = createSlice({
  name: "visualNovelGameTurns",
  initialState: initialState,
  reducers: {
    nextTurn: (state, action: PayloadAction<{}>) => {
      const newTurn = state.entities[state.currentTurnId + 1];
      if (!newTurn) {
        // TODO: generate new turns
        console.log("no more new turn");
        return state;
      }
      // TODO: handle end of scene
      if (newTurn.sceneId !== state.currentSceneId) {
        state.currentSceneId = newTurn.sceneId;
        state.currentCharacters = [];
      }

      // handle auto entering characters
      if (newTurn.activePortrait) {
        if (
          !state.currentCharacters.find(
            (character) => character.name === newTurn.activePortrait
          )
        ) {
          const newCharacter = state.characters.find(
            (character) => character.name === newTurn.activePortrait
          );
          // TODO: what if this character doesn't exist yet?
          // currently just doesn't show a portrait
          if (newCharacter) {
            state.currentCharacters = [
              ...state.currentCharacters,
              newCharacter,
            ].slice(-state.maxConcurrentCharacters);
          }
        }
      }

      // handle actions
      if (newTurn.actions) {
        for (const action of newTurn.actions) {
          switch (action.type) {
            case "enterCharacter":
              state.currentCharacters = [
                ...state.currentCharacters,
                state.characters.find(
                  (character) => character.name === action.value
                ),
              ].slice(-state.maxConcurrentCharacters);
              break;
            case "exitCharacter":
              state.currentCharacters = state.currentCharacters.filter(
                (character) => character.name !== action.value
              );
              break;
            default:
              break;
          }
        }
      }
      state.currentTurnId++;
      return state;
    },
    goToTurn: (state, action: PayloadAction<{ turnId: number }>) => {
      state.currentTurnId = action.payload.turnId;
      // TODO: currently doesn't handle scene change or character change
      return state;
    },
    setWorld: (
      state,
      action: PayloadAction<{
        world: VisualNovelGameWorld;
      }>
    ) => {
      state.world = action.payload.world;
      return state;
    },
    setScenes: (
      state,
      action: PayloadAction<{ scenes: VisualNovelGameScene[] }>
    ) => {
      state.scenes = action.payload.scenes;
      return state;
    },
    upsertScenes: (
      state,
      action: PayloadAction<{ scenes: VisualNovelGameScene[] }>
    ) => {
      // TODO: replace this with the same one from the maker
      let newScenes = [...state.scenes];
      for (const scene of action.payload.scenes) {
        if (newScenes.find((obj) => obj.id === scene.id)) {
          newScenes = newScenes.map((obj) =>
            obj.id == scene.id ? scene : obj
          );
        } else {
          newScenes = [...newScenes, scene];
        }
      }
      state.scenes = newScenes;
      return state;
    },
    upsertTurns: (
      state,
      action: PayloadAction<{ turns: VisualNovelGameTurn[] }>
    ) => {
      visualNovelGameTurnsAdapter.upsertMany(state, action.payload.turns);
      return state;
    },
    addManyTurns: (
      state,
      action: PayloadAction<{ turns: VisualNovelGameTurn[] }>
    ) => {
      const turnsCopy = JSON.parse(
        JSON.stringify(action.payload.turns)
      ) as VisualNovelGameTurn[];

      // update the turn ids
      let nextId = state.ids.length;
      for (const turn of turnsCopy) {
        turn.id = nextId;
        nextId++;
      }

      visualNovelGameTurnsAdapter.addMany(state, turnsCopy);
      return state;
    },
    setCharacters: (
      state,
      action: PayloadAction<{ characters: VisualNovelGameCharacter[] }>
    ) => {
      state.characters = action.payload.characters;
      return state;
    },
    addToWorldHistory: (state, action: PayloadAction<{ history: string }>) => {
      state.storySoFar = [...state.storySoFar, action.payload.history];
      return state;
    },
    setPreviousSceneScripts: (
      state,
      action: PayloadAction<{ scripts: string[] }>
    ) => {
      // only keep the last 4 scripts
      state.previousSceneScripts = action.payload.scripts.slice(-4);
      return state;
    },
    setInit: (state, action: PayloadAction<{ init: boolean }>) => {
      state.init = action.payload.init;
      return state;
    },
    setConfig: (state, action: PayloadAction<{ showConfig: boolean }>) => {
      state.showConfig = action.payload.showConfig;
      return state;
    },
    setShowHistory: (
      state,
      action: PayloadAction<{ showHistory: boolean }>
    ) => {
      state.showHistory = action.payload.showHistory;
      return state;
    },
    setAutoGenerate: (
      state,
      action: PayloadAction<{ autoGenerate: boolean }>
    ) => {
      state.autoGenerate = action.payload.autoGenerate;
      return state;
    },
    setAutoNextTurn: (
      state,
      action: PayloadAction<{ autoNextTurn: boolean }>
    ) => {
      state.autoNextTurn = action.payload.autoNextTurn;
      return state;
    },
    setTextSize: (state, action: PayloadAction<{ textSize: number }>) => {
      state.textSize = action.payload.textSize;
      return state;
    },
    setSpeech: (state, action: PayloadAction<{ speech: boolean }>) => {
      state.speech = action.payload.speech;
      return state;
    },
    setMusic: (state, action: PayloadAction<{ music: boolean }>) => {
      state.music = action.payload.music;
      return state;
    },
    setHideYoutube: (
      state,
      action: PayloadAction<{ hideYoutube: boolean }>
    ) => {
      state.hideYoutube = action.payload.hideYoutube;
      return state;
    },
    setShowCredits: (
      state,
      action: PayloadAction<{ showCredits: boolean }>
    ) => {
      state.showCredits = action.payload.showCredits;
      return state;
    },
    setShowLoadSave: (
      state,
      action: PayloadAction<{ showLoadSave: boolean }>
    ) => {
      state.showLoadSave = action.payload.showLoadSave;
      return state;
    },
    loadGameFromSave: (state, action: PayloadAction<{ state }>) => {
      state = action.payload.state;
      // state.showConfig = false;
      return state;
    },
    resetGamePlayerState: (state, action: PayloadAction<{}>) => {
      state = initialState;
      return state;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  nextTurn,
  goToTurn,
  setWorld, // not used
  setScenes, // not used
  upsertScenes,
  upsertTurns, // not used
  addManyTurns,
  setCharacters, // not used
  addToWorldHistory, // not used
  setPreviousSceneScripts, // not used
  setInit,
  setConfig,
  setAutoGenerate,
  setAutoNextTurn,
  setTextSize,
  setSpeech,
  setMusic,
  setHideYoutube,
  setShowHistory,
  setShowCredits,
  setShowLoadSave,
  loadGameFromSave,
  resetGamePlayerState,
} = visualNovelGameTurnsSlice.actions;

export default visualNovelGameTurnsSlice.reducer;

export const { selectAll: selectAllTurns, selectById: selectTurnById } =
  visualNovelGameTurnsAdapter.getSelectors<RootState>(
    (state) => state.visualNovelGameTurns
  );
