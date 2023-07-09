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

export enum ImageGeneratorProvider {
  openai = "openai",
  stability = "stability",
}

export interface GenerateImageForm {
  // using DALL-E's API
  prompt: string;
  n: 1;
  size: "1024x1024" | "512x512" | "256x256";
  response_format: "url" | "b64_json";
}

export interface GenerateImageStabilityForm {
  // https://platform.stability.ai/rest-api#tag/v1generation/operation/textToImage
  engine: string; // default "stable-diffusion-xl-beta-v2-2-2"
  text_prompts: { text: string; weight: number }[];
  height?: number; // default 512
  width?: number; // default 512
  cfg_scale?: number; // default 7
  clip_guidance_preset?: string; // default "NONE"
  sampler?: string; // default automatic
  samples?: number; // default 1, number of images to generate
  seed?: number; // default random
  steps?: number; // default 50
  style_preset?: string; // default none
  extras?: any;
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

export const generateImageStability = createAsyncThunk(
  "images/generateImageStability",
  async (
    payload: GenerateImageStabilityForm,
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const stabilityKey = state.systemSettings.stabilityKey;
      const useProxy = state.systemSettings.useProxy;
      const proxyKey = state.systemSettings.proxyKey;
      const url = useProxy
        ? `/api/v0/proxy/stability/generation/${payload.engine}/text-to-image`
        : `https://api.stability.ai/v1/generation/${payload.engine}/text-to-image`;
      console.log(`images (stability) - generate - ${payload}`);
      const response = await client.post(url, payload, {
        headers: {
          Authorization: `Bearer ${stabilityKey}`,
          "x-proxy-key": proxyKey,
          "Content-Type": "application/json",
          "Stability-Client-ID": "mirroredfables",
          "Stability-Client-Version": "1",
        },
      });
      return response;
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

export const saveImageB64 = createAsyncThunk(
  "images/saveImageB64",
  async (payload: { image: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const rootUrl = state.systemSettings.localServer
        ? "http://localhost:8788"
        : "";
      const url = `${rootUrl}/api/v0/saveimageraw`;
      console.log(`images - save raw`);
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
