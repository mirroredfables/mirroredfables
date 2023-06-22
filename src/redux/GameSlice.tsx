import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

import { client } from "./client";
import type { RootState } from "./Store";

import {
  VisualNovelGameBackground,
  VisualNovelGameCharacter,
  VisualNovelGameScene,
  VisualNovelGameTurn,
  VisualNovelGameWorld,
} from "./VisualNovelGameTypes";
import { convertScenesToTurnsEntities } from "./VisualNovelGameMakerSlice";

interface GameGenerator {
  init: boolean;
  generatorBusy: boolean;
  completed: boolean;
  // TODO: maybe messages should have an actual type
  // for example: seperate messages from users, vs AI, vs status notifications
  messages: string[];
}

const initialGameGenerator: GameGenerator = {
  init: false,
  generatorBusy: false,
  completed: false,
  messages: [],
};

interface GamePlayerSettings {
  // TODO: organize these better
  init: boolean;
  autoGenerate: boolean;
  autoNextTurn: boolean;
  textSize: number;
  speech: boolean;
  music: boolean;
  hideYoutube: boolean;
  showConfig: boolean;
  showHistory: boolean;
  showCredits: boolean;
  showLoadSave: boolean;
  maxConcurrentCharacters: number;
}

const initialGamePlayerSettings: GamePlayerSettings = {
  init: false,
  autoGenerate: false,
  autoNextTurn: false,
  textSize: 16, // should this carry over between resets?
  speech: false,
  music: false,
  hideYoutube: false,
  showConfig: false,
  showHistory: false,
  showCredits: false,
  showLoadSave: false,
  maxConcurrentCharacters: 2,
};

interface UpdatableGamePlayerSettings {
  // TODO: organize these better
  init?: boolean;
  autoGenerate?: boolean;
  autoNextTurn?: boolean;
  textSize?: number;
  speech?: boolean;
  music?: boolean;
  hideYoutube?: boolean;
  showConfig?: boolean;
  showHistory?: boolean;
  showCredits?: boolean;
  showLoadSave?: boolean;
  maxConcurrentCharacters?: number;
}

interface GameData {
  // new stuff
  creator: string;
  canModify: boolean;
  name: string;
  // moved stuff
  speechPrerecorded: boolean;
  speechPrerecordedUrl: string;
  // old stuff
  world: VisualNovelGameWorld;
  titleBackground: VisualNovelGameBackground;
  storySoFar: string[];
  characters: VisualNovelGameCharacter[];
  scenes: VisualNovelGameScene[];
}

const initialGameData: GameData = {
  creator: "",
  canModify: false,
  name: "",
  speechPrerecorded: false,
  speechPrerecordedUrl: "",
  world: {
    setting: "",
    artStyle: "",
    writingStyle: "",
  },
  titleBackground: {
    name: "",
    image: "",
  },
  storySoFar: [],
  characters: [],
  scenes: [],
};

interface CurrentTurnData {
  currentSceneId: number;
  currentTurnId: number;
  // the following should be calculated from the above
  currentCharacters: VisualNovelGameCharacter[];
}

const initialCurrentTurnData: CurrentTurnData = {
  currentSceneId: 0,
  currentTurnId: 0,
  currentCharacters: [],
};

interface GameSliceState {
  gameGenerator: GameGenerator;
  gamePlayerSettings: GamePlayerSettings;
  gameData: GameData;
  currentTurnData: CurrentTurnData;
}

export interface GameSaveFile {
  id: number;
  name: string;
  timestamp: number;
  previewText: string;
  gameEngineVersion: string;
  newGame: boolean;
  data: GameSliceState;
}

const gameAdapter = createEntityAdapter<VisualNovelGameTurn>({
  selectId: (turn) => turn.id,
  sortComparer: (a, b) => a.id - b.id,
});

const initialState = gameAdapter.getInitialState({
  gameGenerator: initialGameGenerator,
  gamePlayerSettings: initialGamePlayerSettings,
  gameData: initialGameData,
  currentTurnData: initialCurrentTurnData,
});

const gameSlice = createSlice({
  name: "game",
  initialState: initialState,
  reducers: {
    // general
    loadGameFromFile: (state, action: PayloadAction<GameSaveFile>) => {
      const { data } = action.payload;
      state.gameGenerator = data.gameGenerator;
      state.gamePlayerSettings = data.gamePlayerSettings;
      state.gameData = data.gameData;
      state.currentTurnData = data.currentTurnData;
      // TODO: still need to convert the gameData to turns
      // then reset turns
      const { ids, entities } = convertScenesToTurnsEntities({
        scenes: state.gameData.scenes,
      });
      state.ids = ids;
      state.entities = entities;
      return state;
    },
    resetGameFully: (state, action: PayloadAction<{}>) => {
      state.gameGenerator = initialGameGenerator;
      state.gamePlayerSettings = initialGamePlayerSettings;
      state.gameData = initialGameData;
      state.currentTurnData = initialCurrentTurnData;
      // TODO: reset turns
      return state;
    },
    // player
    setPlayerSettings: (
      state,
      action: PayloadAction<UpdatableGamePlayerSettings>
    ) => {
      state.gamePlayerSettings = {
        ...state.gamePlayerSettings,
        ...action.payload,
      };
      return state;
    },
    resetGamePlayer: (state, action: PayloadAction<{}>) => {
      state.gamePlayerSettings = initialGamePlayerSettings;
      return state;
    },
    nextTurn: (state, action: PayloadAction<{}>) => {
      const newTurn = state.entities[state.currentTurnData.currentTurnId + 1];
      if (!newTurn) {
        // TODO: generate new turns
        console.log("no more new turn");
        return state;
      }
      // TODO: handle end of scene
      if (newTurn.sceneId !== state.currentTurnData.currentSceneId) {
        state.currentTurnData.currentSceneId = newTurn.sceneId;
        state.currentTurnData.currentCharacters = [];
      }

      // handle auto entering characters
      if (newTurn.activePortrait) {
        if (
          !state.currentTurnData.currentCharacters.find(
            (character) => character.name === newTurn.activePortrait
          )
        ) {
          const newCharacter = state.gameData.characters.find(
            (character) => character.name === newTurn.activePortrait
          );
          // TODO: what if this character doesn't exist yet?
          // currently just doesn't show a portrait
          if (newCharacter) {
            state.currentTurnData.currentCharacters = [
              ...state.currentTurnData.currentCharacters,
              newCharacter,
            ].slice(-state.gamePlayerSettings.maxConcurrentCharacters);
          }
        }
      }

      // handle actions
      // they are not currently being used
      if (newTurn.actions) {
        for (const action of newTurn.actions) {
          switch (action.type) {
            case "enterCharacter":
              state.currentTurnData.currentCharacters = [
                ...state.currentTurnData.currentCharacters,
                state.gameData.characters.find(
                  (character) => character.name === action.value
                ),
              ].slice(-state.gamePlayerSettings.maxConcurrentCharacters);
              break;
            case "exitCharacter":
              state.currentTurnData.currentCharacters =
                state.currentTurnData.currentCharacters.filter(
                  (character) => character.name !== action.value
                );
              break;
            default:
              break;
          }
        }
      }
      state.currentTurnData.currentTurnId++;
      return state;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  loadGameFromFile,
  resetGameFully,
  setPlayerSettings,
  resetGamePlayer,
  nextTurn,
} = gameSlice.actions;

export default gameSlice.reducer;

export const { selectAll: selectAllTurns, selectById: selectTurnById } =
  gameAdapter.getSelectors<RootState>((state) => state.game);
