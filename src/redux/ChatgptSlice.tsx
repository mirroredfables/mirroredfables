import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import { client } from "./client";
import type { RootState } from "./Store";

export enum GptModel {
  GPT3 = "gpt-3.5-turbo",
  GPT4 = "gpt-4",
}

export interface ChatgptRquestMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatgptRequestData {
  messages: ChatgptRquestMessage[];
  model: GptModel;
}

export interface ChatgptResponseChoice {
  index: number;
  message: ChatgptRquestMessage;
  finish_reason: "stop" | "length";
}

export interface ChatgptResponseData {
  id: string;
  object: "chat.completion";
  created: number;
  choices: ChatgptResponseChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AskChatgptForm {
  question: string;
  systemMessage?: string;
}

export interface ConfigureGptForm {
  key: string;
  model: GptModel;
}

export const askChatgpt = createAsyncThunk(
  "chatgpt/askChatgpt",
  async (payload: AskChatgptForm, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const authToken = state.systemSettings.openAiKey;
      const url = `https://api.openai.com/v1/chat/completions`;
      console.log(`chatgpt - askChatgpt - ${payload.question}`);
      const requestData: ChatgptRequestData = {
        messages: [
          ...(payload.systemMessage
            ? [
                {
                  role: "system",
                  content: payload.systemMessage,
                } as ChatgptRquestMessage,
              ]
            : []),
          {
            role: "user",
            content: payload.question,
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
      return rejectWithValue(err);
    }
  }
);

export const testConfigChatgpt = createAsyncThunk(
  "chatgpt/testConfigChatgpt",
  // it's the exact same as askChatgpt, but with a different handler
  async (payload: ConfigureGptForm, { getState, rejectWithValue }) => {
    try {
      const authToken = payload.key;
      const url = `https://api.openai.com/v1/chat/completions`;
      console.log(`chatgpt - testConfigChatgpt`);
      const requestData: ChatgptRequestData = {
        messages: [
          {
            role: "user",
            content: "hello",
          },
        ],
        model: payload.model,
      };
      const response = await client.post(url, requestData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

interface ChatgptState {
  testConfigResponse: string;
  testElevenConfigResponse: string;
}

export interface ChatgptMessage {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  created: number;
  rawData: any;
}

const ChatgptAdpater = createEntityAdapter<ChatgptMessage>({
  selectId: (message) => message.id,
  sortComparer: (a, b) => a.created - b.created,
});

const initialState = ChatgptAdpater.getInitialState<ChatgptState>({
  testConfigResponse: "not tested",
  testElevenConfigResponse: "test not available (TODO)",
});

export const chatgptSlice = createSlice({
  name: "chatgpt",
  initialState: initialState,
  reducers: {
    addHumanMessage: (state, action: PayloadAction<AskChatgptForm>) => {
      const message: ChatgptMessage = {
        id: uuidv4(),
        role: "user",
        content: action.payload.question,
        created: Date.now(),
        rawData: null,
      };
      ChatgptAdpater.upsertOne(state, message);
      return state;
    },
    // TODO: this is very hacky, shouldn't be here but whatever
    setTestElevenConfigResponse: (
      state,
      action: PayloadAction<{ response: string }>
    ) => {
      state.testElevenConfigResponse = action.payload.response;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(askChatgpt.fulfilled, (state, action) => {
      const response = action.payload as ChatgptResponseData;
      const message: ChatgptMessage = {
        id: response.id,
        role: "assistant",
        content: response.choices[0].message.content,
        created: Date.now(),
        rawData: response,
      };
      ChatgptAdpater.upsertOne(state, message);
    });
    builder.addCase(testConfigChatgpt.pending, (state, action) => {
      state.testConfigResponse = "chatgpt config test in progress";
    });
    builder.addCase(testConfigChatgpt.fulfilled, (state, action) => {
      state.testConfigResponse = "chatgpt config test succeeded";
    });
    builder.addCase(testConfigChatgpt.rejected, (state, action) => {
      if (action.payload) {
        state.testConfigResponse = `chatgpt config test failed: ${JSON.stringify(
          action.payload
        )}`;
      } else {
        state.testConfigResponse = `chatgpt config test failed: ${action.error.message}`;
      }
    });
  },
});

export const { addHumanMessage, setTestElevenConfigResponse } =
  chatgptSlice.actions;

export default chatgptSlice.reducer;

export const {
  selectAll: selectAllChatgptMessages,
  selectById: selectChatgptMessageById,
} = ChatgptAdpater.getSelectors((state: RootState) => state.chatgpt);
