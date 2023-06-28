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

function upsertObjects(
  A: { id: number }[],
  B: { id: number }[]
): { id: number }[] {
  // Create a map of objects in A using their ids as keys
  const aMap = new Map<number, { id: number }>(
    A.map((item) => [item.id, item])
  );

  // Iterate over B array
  B.forEach((item) => {
    // If the id exists in the map, replace the object, otherwise insert the object
    aMap.set(item.id, item);
  });

  // Convert the map values to an array and sort it by id
  return Array.from(aMap.values()).sort((a, b) => a.id - b.id);
}

const convertScriptToTurn = (input: {
  script: { id: number; line: string };
  latestTurn: number;
  scene: number;
}) => {
  // sample script line
  // [Narrator] Leona arrives at NYU dorm, eager to start her college life in New York City. As she enters her new room, she meets her roommate Yumi.

  const turn: VisualNovelGameTurn = {
    id: input.latestTurn + input.script.id + 1,
    sceneId: input.scene,
    type: "text",
    text: input.script.line,
  };

  const speakerMatch = input.script.line.match(/\[(.*?)\]/);
  if (speakerMatch) {
    const speaker = speakerMatch[1];
    if (speaker != "Narrator") {
      turn.activePortrait = speaker;
      turn.type = "speech";
    }
  }

  return turn;
};

const convertSceneToTurns = (input: {
  scene: VisualNovelGameScene;
  latestTurn?: number;
}) => {
  const formatScriptToLines = (script: string) => {
    const lines = script.split("\n");
    const result = [];
    let id = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() !== "") {
        result.push({ id: id, line: lines[i].trim() });
        id++;
      }
    }
    return result;
  };
  const scripts = formatScriptToLines(input.scene.script);

  const turns = scripts.map((scriptLine) => {
    return convertScriptToTurn({
      script: scriptLine,
      latestTurn: input.latestTurn ?? -1,
      scene: input.scene.id,
    });
  });

  return turns;
};

const convertScenesToTurnsEntities = (input: {
  scenes: VisualNovelGameScene[];
}) => {
  const turns = [];
  // const turns = convertSceneToTurns(input);
  for (const scene of input.scenes) {
    if (!scene.script) {
      continue;
    }
    const sceneTurns = convertSceneToTurns({
      scene: scene,
      latestTurn: turns.length - 1,
    });
    turns.push(...sceneTurns);
  }

  const convertArrayToObject = (array, key) =>
    array.reduce((acc, curr) => {
      acc[curr[key]] = curr;
      return acc;
    }, {});

  return {
    ids: turns.map((turn) => turn.id),
    entities: convertArrayToObject(turns, "id"),
  };
};

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
  speech: true,
  music: true,
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

export interface GameSliceState {
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
      // convert the gameData to turns
      // then reset turns
      const { ids, entities } = convertScenesToTurnsEntities({
        scenes: state.gameData.scenes,
      });
      state.ids = ids;
      state.entities = entities;
      return state;
    },
    loadGameFromState: (state, action: PayloadAction<GameSliceState>) => {
      state.currentTurnData = action.payload.currentTurnData;
      state.gameData = action.payload.gameData;
      // TODO: should it use generator and player settings?
      state.gameGenerator = action.payload.gameGenerator;
      state.gamePlayerSettings = action.payload.gamePlayerSettings;

      return state;
    },
    resetGameFully: (state, action: PayloadAction<{}>) => {
      // TODO: here's a hack
      // we keep the game generator's previous messages
      state.gameGenerator = {
        ...initialGameGenerator,
        messages: state.gameGenerator.messages,
      };
      state.gamePlayerSettings = initialGamePlayerSettings;
      state.gameData = initialGameData;
      state.currentTurnData = initialCurrentTurnData;
      // reset turns
      state.ids = [];
      state.entities = {};
      return state;
    },
    // maker
    addGameMakerMessage: (
      state,
      action: PayloadAction<{ message: string }>
    ) => {
      state.gameGenerator.messages = [
        ...state.gameGenerator.messages,
        action.payload.message,
      ];
      return state;
    },
    setInitialWorld: (
      state,
      action: PayloadAction<{
        request: string;
        world: VisualNovelGameWorld;
        characters: VisualNovelGameCharacter[];
        titleBackground: VisualNovelGameBackground;
      }>
    ) => {
      // state.gameData.init = true;
      state.gameData.world = action.payload.world;
      state.gameData.characters = action.payload.characters;
      state.gameData.titleBackground = action.payload.titleBackground;
      return state;
    },
    upsertScenes: (
      state,
      action: PayloadAction<{ scenes: VisualNovelGameScene[] }>
    ) => {
      state.gameData.scenes = upsertObjects(
        state.gameData.scenes,
        action.payload.scenes
      ) as VisualNovelGameScene[];
      // then update the story so far
      state.gameData.storySoFar = state.gameData.scenes.map(
        (scene) => scene.summary
      );
      // then update the turns based on this
      const { ids, entities } = convertScenesToTurnsEntities({
        scenes: state.gameData.scenes,
      });
      state.ids = ids;
      state.entities = entities;
      return state;
    },
    setCompleted: (state, action: PayloadAction<{ completed: boolean }>) => {
      state.gameGenerator.completed = action.payload.completed;
      return state;
    },
    setGeneratorBusy: (state, action: PayloadAction<{ busy: boolean }>) => {
      // TODO: technically this is only busy when generating new full scenes
      state.gameGenerator.generatorBusy = action.payload.busy;
      return state;
    },

    // editor
    rewriteStory: (
      state,
      action: PayloadAction<{ sceneId: number; turnId: number; text: string }>
    ) => {
      // replace the turn text
      state.entities[action.payload.turnId].text = action.payload.text;
      // remove all scenes after this one
      state.gameData.scenes = state.gameData.scenes.filter(
        (scene) => scene.id <= action.payload.sceneId
      );
      // remove from story so far, including this scene
      state.gameData.storySoFar = state.gameData.storySoFar.filter(
        (summary, index) => index < action.payload.sceneId
      );
      // remove all turns after this one
      state.entities = Object.fromEntries(
        Object.entries(state.entities).filter(
          ([id, turn]) => turn.id <= action.payload.turnId
        )
      );
      state.ids = Object.keys(state.entities).map((id) => parseInt(id));

      // TODO: should they belong here?
      // setup the settings for autogenerate
      state.gamePlayerSettings.autoGenerate = true;

      // discontinue pre-recorded voice
      state.gameData.speechPrerecorded = false;

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
      // reset turns
      state.ids = [];
      state.entities = {};
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
  loadGameFromState,
  resetGameFully,
  addGameMakerMessage,
  setInitialWorld,
  upsertScenes,
  setCompleted,
  setGeneratorBusy,
  rewriteStory,
  setPlayerSettings,
  resetGamePlayer,
  nextTurn,
} = gameSlice.actions;

export default gameSlice.reducer;

export const { selectAll: selectAllTurns, selectById: selectTurnById } =
  gameAdapter.getSelectors<RootState>((state) => state.game);
