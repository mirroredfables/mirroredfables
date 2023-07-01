import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

import { client } from "./client";
import type { RootState } from "./Store";
import { ChatgptRequestData } from "./ChatgptSlice";
import { generateRewriteDallERequestPromptTemplate } from "../prompts/GamePrompts";

export interface GenerateImageForm {
  // using DALL-E's API
  prompt: string;
  n: 1;
  size: "1024x1024" | "512x512" | "256x256";
  response_format: "url" | "b64_json";
}

export const generateImage = createAsyncThunk(
  "images/generateImage",
  async (payload: GenerateImageForm, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const authToken = state.systemSettings.openAiKey;
      const useProxy = state.systemSettings.useProxy;
      const proxyKey = state.systemSettings.proxyKey;
      const url = useProxy
        ? `/api/v0/proxy/openai/images/generations`
        : `https://api.openai.com/v1/images/generations`;
      console.log(`images - generate - ${payload.prompt}`);
      const response = await client.post(url, payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "x-proxy-key": proxyKey,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const saveImage = createAsyncThunk(
  "images/saveImage",
  async (payload: { image: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const rootUrl = state.systemSettings.localServer
        ? "http://localhost:8788"
        : "";
      const url = `${rootUrl}/api/v0/saveimage`;
      console.log(`images - save - ${payload.image}`);
      const response = await client.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const rewriteDallERequestPrompt = createAsyncThunk(
  "images/rewriteDallERequestPrompt",
  async (payload: { prompt: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const authToken = state.systemSettings.openAiKey;
      const useProxy = state.systemSettings.useProxy;
      const proxyKey = state.systemSettings.proxyKey;
      const url = useProxy
        ? `/api/v0/proxy/openai/chat/completions`
        : `https://api.openai.com/v1/chat/completions`;
      const requestData: ChatgptRequestData = {
        messages: [
          {
            role: "user",
            content: generateRewriteDallERequestPromptTemplate(payload).prompt,
          },
        ],
        model: state.systemSettings.openAiGptModel,
      };
      const response = await client.post(url, requestData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "x-proxy-key": proxyKey,
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

interface ImagesState {
  currentImage: string;
}

const initialState: ImagesState = {
  currentImage: "",
};

export const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(generateImage.fulfilled, (state, action) => {
      if (action.meta.arg.response_format === "url") {
        state.currentImage = action.payload[0].url;
      } else if (action.meta.arg.response_format === "b64_json") {
        state.currentImage = `data:image/png;base64,${action.payload[0].b64_json}`;
      }
    });
  },
});

export default imagesSlice.reducer;
