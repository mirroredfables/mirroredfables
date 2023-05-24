import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  gameSystemPromptTemplate,
  generateElevenVoiceSelectionPromptTemplate,
  generateFixJsonPromptTemplate,
  generateGameScenesGenPromptTemplate,
  generateGameScriptsGenPromptTemplate,
  generateGameWorldGenPromptTemplate,
} from "../prompts/GamePrompts";
import { ChatgptRequestData } from "./ChatgptSlice";

import { client } from "./client";
import type { RootState } from "./Store";
import {
  VisualNovelGameWorld,
  VisualNovelGameCharacter,
  VisualNovelGameCharacterForGenerator,
  VisualNovelGameCharacterVoice,
  VisualNovelGameScene,
  VisualNovelGameBackground,
  VisualNovelGameSceneForGenerator,
  VisualNovelGameSceneForGeneratorWithScript,
  VisualNovelGameTurn,
} from "./VisualNovelGameTypes";

import { GameSaveFile } from "./VisualNovelGameTurnsSlice";

export interface VisualNovelGameMakerGameState {
  init: boolean;
  world: VisualNovelGameWorld;
  titleBackground: VisualNovelGameBackground;
  storySoFar: string[];
  characters: VisualNovelGameCharacter[];
  scenes: VisualNovelGameScene[];
  completedGameSave: GameSaveFile | null;
  completed: boolean;
}

export const defaultVisualNovelGameMakerGameState = {
  init: false,
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
  completedGameSave: null,
  completed: false,
} as VisualNovelGameMakerGameState;

export interface VisualNovelGameMakerState {
  messages: string[];
  gameState: VisualNovelGameMakerGameState;
  generatorBusy: boolean;
}

const initialState: VisualNovelGameMakerState = {
  messages: [],
  gameState: defaultVisualNovelGameMakerGameState,
  generatorBusy: false,
};

export interface GenerateInitialWorldResponseData {
  request: string;
  world: VisualNovelGameWorld;
  characters: VisualNovelGameCharacterForGenerator[];
  titleBackground?: VisualNovelGameBackground;
}

export const generateInitialWorldResponseDataTemplate = {
  request: "string",
  world: { setting: "string", artStyle: "string", writingStyle: "string" },
  characters: {
    id: "number",
    name: "string",
    description: "string",
  },
};

export interface GenerateVoicesResponseData {
  characters: {
    id: number;
    name: string;
    description: string;
    voice: VisualNovelGameCharacterVoice;
  }[];
}

export const generateVoicesResponseDataTemplate = {
  characters: [
    {
      id: "number",
      name: "string",
      description: "string",
      voice: {
        type: "string",
        voiceId: "string",
        name: "string",
        gender: "string",
      },
    },
  ],
};

export interface GenerateInitialScenesResponseData {
  scenes: VisualNovelGameSceneForGenerator[];
}

export const generateInitialScenesResponseDataTemplate = {
  scenes: [
    {
      id: "number",
      name: "string",
    },
  ],
};

export interface GenerateScriptResponseData {
  scene: VisualNovelGameSceneForGeneratorWithScript;
}

export const generateScriptResponseDataTemplate = {
  scene: {
    id: "number",
    name: "string",
    script: "string",
    location: "string",
    musicRecommendation: "string",
    summary: "string",
  },
};

const shortenCharacters = (characters: VisualNovelGameCharacter[]) => {
  const result = characters.map((character) => {
    return {
      id: character.id,
      name: character.name,
      description: character.description,
    } as VisualNovelGameCharacterForGenerator;
  });
  return result;
};

const shortenScene = (scene: VisualNovelGameScene) => {
  return {
    id: scene.id,
    name: scene.name,
  } as VisualNovelGameSceneForGenerator;
};

const shortenScenes = (scenes: VisualNovelGameScene[]) => {
  const result = scenes.map((scene) => {
    return shortenScene(scene);
  });
  return result;
};

const shortenSceneAsGeneratorOutput = (input: VisualNovelGameScene) => {
  return {
    scene: {
      id: input.id,
      name: input.name,
      script: input.script,
      location: input.location,
      musicRecommendation: input.musicRecommendation,
      summary: input.summary,
    },
  } as GenerateScriptResponseData;
};

const cleanupScenes = (scenes: VisualNovelGameScene[]) => {
  // remove the script
  const result = scenes.map((scene) => {
    return {
      id: scene.id,
      name: scene.name,
      summary: scene.summary,
      location: scene.location,
      background: scene.background,
      music: scene.music,
    } as VisualNovelGameScene;
  });
  return result;
};

export const convertScriptToTurn = (input: {
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

export const convertSceneToTurns = (input: {
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

export const convertScenesToTurnsEntities = (input: {
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

export const exportCompletedGameAsSave = (
  gameMakerGameState: VisualNovelGameMakerGameState
) => {
  const initialGame = {
    init: false,
    autoGenerate: true,
    autoNextTurn: false,
    // TODO: this is a hacky way to figure out whether to use speech or not
    speech: gameMakerGameState.characters[0].voice ? true : false,
    // speech: true,
    // speech: false,
    music: true,
    // hideYoutube: true,
    hideYoutube: false,
    showConfig: false,
    showHistory: false,
    showCredits: false,
    showLoadSave: false,
    maxConcurrentCharacters: 2,
    titleBackground: gameMakerGameState.titleBackground,
    scenes: cleanupScenes(gameMakerGameState.scenes),
    characters: gameMakerGameState.characters,
    currentSceneId: 0,
    currentTurnId: 0,
    currentCharacters: [],
    previousSceneScripts: [],
    world: {
      setting: gameMakerGameState.world.setting,
      artStyle: gameMakerGameState.world.artStyle,
      writingStyle: gameMakerGameState.world.writingStyle,
      history: [],
    },
  };

  const initialScenesToTurnsEntities = convertScenesToTurnsEntities({
    scenes: gameMakerGameState.scenes,
  });

  return {
    id: 0,
    timestamp: Date.now(),
    previewText: gameMakerGameState.world.setting,
    gameEngineVersion: "0",
    newGame: true,
    data: {
      ...initialGame,
      ...initialScenesToTurnsEntities,
    },
  } as GameSaveFile;
};

export const fixBrokenJson = createAsyncThunk(
  "visualNovelGameMaker/fixBrokenJson",
  async (
    input: { jsonString: string; jsonTemplate?: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const authToken = state.systemSettings.openAiKey;
      const url = `https://api.openai.com/v1/chat/completions`;
      const requestData: ChatgptRequestData = {
        messages: [
          {
            role: "user",
            content: generateFixJsonPromptTemplate(input).prompt,
          },
        ],
        model: state.systemSettings.openAiGptModel,
      };
      const response = await client.post(url, requestData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  }
);

export const generateInitialWorld = createAsyncThunk(
  "visualNovelGameMaker/generateInitialWorld",
  async (input: { setting: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const authToken = state.systemSettings.openAiKey;
      const url = `https://api.openai.com/v1/chat/completions`;
      const requestData: ChatgptRequestData = {
        messages: [
          {
            role: "system",
            content: gameSystemPromptTemplate,
          },
          {
            role: "user",
            content: generateGameWorldGenPromptTemplate({
              inputString: input.setting,
            }).prompt,
          },
        ],
        model: state.systemSettings.openAiGptModel,
      };
      const response = await client.post(url, requestData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  }
);

export const generateVoices = createAsyncThunk(
  "visualNovelGameMaker/generateVoices",
  async (
    input: { characters: VisualNovelGameCharacterForGenerator[] },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const authToken = state.systemSettings.openAiKey;
      const url = `https://api.openai.com/v1/chat/completions`;
      const requestData: ChatgptRequestData = {
        messages: [
          {
            role: "system",
            content: gameSystemPromptTemplate,
          },
          {
            role: "user",
            content: generateElevenVoiceSelectionPromptTemplate({
              inputCharacters: JSON.stringify(input, null, 1),
            }).prompt,
          },
        ],
        model: state.systemSettings.openAiGptModel,
      };
      const response = await client.post(url, requestData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  }
);

export const generateScenes = createAsyncThunk(
  "visualNovelGameMaker/generateScenes",
  async (input: { request: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const authToken = state.systemSettings.openAiKey;
      const url = `https://api.openai.com/v1/chat/completions`;
      const requestData: ChatgptRequestData = {
        messages: [
          {
            role: "system",
            content: gameSystemPromptTemplate,
          },
          {
            role: "user",
            content: generateGameScenesGenPromptTemplate({
              inputString: JSON.stringify(
                {
                  request: input.request,
                  world: state.gameMaker.gameState.world,
                  characters: shortenCharacters(
                    state.gameMaker.gameState.characters
                  ),
                  scenes: shortenScenes(state.gameMaker.gameState.scenes),
                },
                null,
                1
              ),
            }).prompt,
          },
        ],
        model: state.systemSettings.openAiGptModel,
      };
      const response = await client.post(url, requestData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  }
);

export const generateScript = createAsyncThunk(
  "visualNovelGameMaker/generateScript",
  async (
    input: {
      request: string;
      writingStyle?: string;
      targetSceneId?: number;
      exampleScriptsGenInput?: string;
      exampleScriptsGenOutput?: string;
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const authToken = state.systemSettings.openAiKey;
      const url = `https://api.openai.com/v1/chat/completions`;
      const requestData: ChatgptRequestData = {
        messages: [
          {
            role: "system",
            content: gameSystemPromptTemplate,
          },
          {
            role: "user",
            content: generateGameScriptsGenPromptTemplate({
              inputString: JSON.stringify(
                {
                  request: `${input.request} ${
                    input.writingStyle
                      ? `. Write the script in the style of ${input.writingStyle}`
                      : ""
                  }`,
                  targetScene:
                    state.gameMaker.gameState.scenes[input.targetSceneId ?? 0],
                  storySoFar: state.gameMaker.gameState.storySoFar,
                  world: state.gameMaker.gameState.world,
                  characters: shortenCharacters(
                    state.gameMaker.gameState.characters
                  ),
                  scenes: shortenScenes(state.gameMaker.gameState.scenes),
                },
                null,
                1
              ),
              exampleScriptsGenInput: input.exampleScriptsGenInput,
              exampleScriptsGenOutput: input.exampleScriptsGenOutput,
            }).prompt,
          },
        ],
        model: state.systemSettings.openAiGptModel,
      };
      const response = await client.post(url, requestData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  }
);

// use this one for generating scripts from after the first scene, as it will save some tokens
export const generateScriptFromPrevious = createAsyncThunk(
  "visualNovelGameMaker/generateScriptFromPrevious",
  async (
    input: {
      request: string;
      targetSceneId: number;
      writingStyle?: string;
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const authToken = state.systemSettings.openAiKey;
      const url = `https://api.openai.com/v1/chat/completions`;
      const requestData: ChatgptRequestData = {
        messages: [
          {
            role: "system",
            content: gameSystemPromptTemplate,
          },
          {
            role: "user",
            content: generateGameScriptsGenPromptTemplate({
              inputString: JSON.stringify(
                {
                  request: `${input.request} ${
                    input.writingStyle
                      ? `. Write the script in the style of ${input.writingStyle}`
                      : ""
                  }`,
                  targetScene:
                    state.gameMaker.gameState.scenes[input.targetSceneId],
                  storySoFar: state.gameMaker.gameState.storySoFar,
                },
                null,
                1
              ),
              exampleScriptsGenInput: JSON.stringify(
                {
                  request: `${input.request} ${
                    input.writingStyle
                      ? `. Write the script in the style of ${input.writingStyle}`
                      : ""
                  }`,
                  targetScene: shortenScene(
                    state.gameMaker.gameState.scenes[input.targetSceneId - 1]
                  ),
                  storySoFar: state.gameMaker.gameState.storySoFar.slice(0, -1),
                  world: state.gameMaker.gameState.world,
                  characters: shortenCharacters(
                    state.gameMaker.gameState.characters
                  ),
                  scenes: shortenScenes(state.gameMaker.gameState.scenes),
                },
                null,
                1
              ),
              exampleScriptsGenOutput: JSON.stringify(
                shortenSceneAsGeneratorOutput(
                  state.gameMaker.gameState.scenes[input.targetSceneId - 1]
                ),
                null,
                1
              ),
            }).prompt,
          },
        ],
        model: state.systemSettings.openAiGptModel,
      };
      console.log(requestData);
      const response = await client.post(url, requestData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  }
);

// technically this doesn't belong here
export const searchYoutubeForMusic = createAsyncThunk(
  "visualNovelGameMaker/searchYoutubeForMusic",
  async (input: { query: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const rootUrl = state.systemSettings.localServer
        ? "http://localhost:8788"
        : "";
      const url = `${rootUrl}/api/v0/searchyoutube/${input.query}`;
      const response = await client.get(url);
      return response;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  }
);

export const visualNovelGameMakerSlice = createSlice({
  name: "visualNovelGameMaker",
  initialState: initialState,
  reducers: {
    addGameMakerMessage: (
      state,
      action: PayloadAction<{ message: string }>
    ) => {
      state.messages = [...state.messages, action.payload.message];
      return state;
    },
    resetGameMakerGameState: (state, action: PayloadAction<{}>) => {
      state.gameState = initialState.gameState;
      return state;
    },
    loadGameMakerGameState: (
      state,
      action: PayloadAction<VisualNovelGameMakerGameState>
    ) => {
      state.gameState = action.payload;
      return state;
    },
    setArtStyle: (state, action: PayloadAction<{ artStyle: string }>) => {
      state.gameState.world.artStyle = action.payload.artStyle;
      return state;
    },
    setWritingStyle: (
      state,
      action: PayloadAction<{ writingStyle: string }>
    ) => {
      state.gameState.world.writingStyle = action.payload.writingStyle;
      return state;
    },
    setInitialWorld: (
      state,
      action: PayloadAction<GenerateInitialWorldResponseData>
    ) => {
      // state.gameState.init = true;
      state.gameState.world = action.payload.world;
      state.gameState.characters = action.payload.characters;
      state.gameState.titleBackground = action.payload.titleBackground;
      return state;
    },
    upsertScenes: (
      state,
      action: PayloadAction<GenerateInitialScenesResponseData>
    ) => {
      function upsertObjects(
        A: VisualNovelGameSceneForGenerator[],
        B: VisualNovelGameSceneForGenerator[]
      ): VisualNovelGameSceneForGenerator[] {
        // Create a map of objects in A using their ids as keys
        const aMap = new Map<number, VisualNovelGameSceneForGenerator>(
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
      state.gameState.scenes = upsertObjects(
        state.gameState.scenes,
        action.payload.scenes
      );
      return state;
    },
    addToStorySoFar: (state, action: PayloadAction<{ summary: string }>) => {
      state.gameState.storySoFar = [
        ...state.gameState.storySoFar,
        action.payload.summary,
      ];
      return state;
    },
    setCompletedGameSave: (
      state,
      action: PayloadAction<{ gameSave: GameSaveFile }>
    ) => {
      state.gameState.completedGameSave = action.payload.gameSave;
      return state;
    },
    setCompleted: (state, action: PayloadAction<{ completed: boolean }>) => {
      state.gameState.completed = action.payload.completed;
      return state;
    },
    setGeneratorBusy: (state, action: PayloadAction<{ busy: boolean }>) => {
      // TODO: technically this is only busy when generating new full scenes
      state.generatorBusy = action.payload.busy;
      return state;
    },
  },
  extraReducers: {},
});

export const {
  addGameMakerMessage,
  resetGameMakerGameState,
  loadGameMakerGameState,
  setArtStyle, // not used
  setWritingStyle, // not used
  setInitialWorld,
  upsertScenes,
  addToStorySoFar,
  setCompletedGameSave,
  setCompleted,
  setGeneratorBusy,
} = visualNovelGameMakerSlice.actions;

export default visualNovelGameMakerSlice.reducer;
