import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "./client";
import type { RootState } from "./Store";
import { ChatgptRequestData } from "./ChatgptSlice";

import {
  VisualNovelGameCharacter,
  VisualNovelGameCharacterForGenerator,
  VisualNovelGameScene,
  VisualNovelGameSceneForGenerator,
} from "./VisualNovelGameTypes";
import { GameSaveFile } from "./GameSlice";

import {
  gameSystemPromptTemplate,
  generateElevenVoiceSelectionPromptTemplate,
  generateFixJsonPromptTemplate,
  generateGameScenesGenPromptTemplate,
  generateGameScriptsGenPromptTemplate,
  generateGameScriptsUpdatePromptTemplate,
  generateGameWorldGenPromptTemplate,
} from "../prompts/GamePrompts";

export const generateInitialScenesResponseDataTemplate = {
  scenes: [
    {
      id: "number",
      name: "string",
    },
  ],
};

export const generateInitialWorldResponseDataTemplate = {
  request: "string",
  world: { setting: "string", artStyle: "string", writingStyle: "string" },
  characters: {
    id: "number",
    name: "string",
    description: "string",
  },
};

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

export const updateScriptResponseDataTemplate = {
  id: "number",
  name: "string",
  script: "string",
  location: "string",
  musicRecommendation: "string",
  summary: "string",
  music: {
    type: "string",
    name: "string",
    info: "string",
    uri: "string",
    loop: "boolean",
  },
  background: {
    name: "string",
    image: "string",
  },
};

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
  };
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
                  world: state.game.gameData.world,
                  characters: shortenCharacters(state.game.gameData.characters),
                  scenes: shortenScenes(state.game.gameData.scenes),
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
                    state.game.gameData.scenes[input.targetSceneId ?? 0],
                  storySoFar: state.game.gameData.storySoFar,
                  world: state.game.gameData.world,
                  characters: shortenCharacters(state.game.gameData.characters),
                  scenes: shortenScenes(state.game.gameData.scenes),
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
                  targetScene: state.game.gameData.scenes[input.targetSceneId],
                  storySoFar: state.game.gameData.storySoFar,
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
                    state.game.gameData.scenes[input.targetSceneId - 1]
                  ),
                  storySoFar: state.game.gameData.storySoFar.slice(0, -1),
                  world: state.game.gameData.world,
                  characters: shortenCharacters(state.game.gameData.characters),
                  scenes: shortenScenes(state.game.gameData.scenes),
                },
                null,
                1
              ),
              exampleScriptsGenOutput: JSON.stringify(
                shortenSceneAsGeneratorOutput(
                  state.game.gameData.scenes[input.targetSceneId - 1]
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

export const generateSceneWithNewLine = createAsyncThunk(
  "visualNovelGameMaker/generateSceneWithNewLine",
  async (
    input: {
      request?: string;
      targetSceneId: number;
      oldLine: string;
      newLine: string;
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
            content: generateGameScriptsUpdatePromptTemplate({
              request: input.request,
              scene: JSON.stringify(
                state.game.gameData.scenes[input.targetSceneId],
                null,
                1
              ),
              oldLine: input.oldLine,
              newLine: input.newLine,
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

// technically this also doesn't belong here
export const saveGameToServer = createAsyncThunk(
  "visualNovelGameMaker/saveGameToServer",
  async (payload: { game: GameSaveFile }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const rootUrl = state.systemSettings.localServer
        ? "http://localhost:8788"
        : "";
      const url = `${rootUrl}/api/v0/savejson`;
      const response = await client.post(url, payload.game, {
        headers: {
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
