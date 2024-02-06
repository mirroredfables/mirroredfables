import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./Store";

// TODO: technically this doesn't belong here
export enum VoiceProvider {
  eleven = "eleven",
  azure = "azure",
}

export const publicElevenVoices = {
  // https://api.elevenlabs.io/v1/voices
  // As of 2023-04-14
  voices: [
    {
      type: "elevenAI",
      voice_id: "21m00Tcm4TlvDq8ikWAM",
      name: "Rachel",
      gender: "female",
    },
    {
      type: "elevenAI",
      voice_id: "AZnzlk1XvdvUeBnXmlld",
      name: "Domi",
      gender: "female",
    },
    // this is the default narrator voice
    // {
    //   type: "elevenAI",
    //   voice_id: "EXAVITQu4vr4xnSDxMaL",
    //   name: "Bella",
    //   gender: "female",
    // },
    {
      type: "elevenAI",
      voice_id: "ErXwobaYiN019PkySvjV",
      name: "Antoni",
      gender: "male",
    },
    {
      type: "elevenAI",
      voice_id: "MF3mGyEYCl7XYWbV9V6O",
      name: "Elli",
      gender: "female",
    },
    {
      type: "elevenAI",
      voice_id: "TxGEqnHWrfWFTfGW9XjX",
      name: "Josh",
      gender: "male",
    },
    {
      type: "elevenAI",
      voice_id: "VR6AewLTigWG4xSOukaG",
      name: "Arnold",
      gender: "male",
    },
    {
      type: "elevenAI",
      voice_id: "pNInz6obpgDQGcFmaJgB",
      name: "Adam",
      gender: "male",
    },
    {
      type: "elevenAI",
      voice_id: "yoZ06aMxZJJ28mfd3POQ",
      name: "Sam",
      gender: "male",
    },
  ],
};

interface ElevenTextToSpeechInput {
  voiceId: string;
  text: string;
  stability?: number;
  similarityBoost?: number;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const useProxy = state.systemSettings.useProxy;
    const proxyKey = state.systemSettings.proxyKey;
    if (useProxy) {
      headers.set("x-proxy-key", proxyKey);
    }
    // TODO: if using proxy, no need for elevenKey
    const elevenKey = state.systemSettings.elevenKey;
    headers.set("xi-api-key", elevenKey);
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const state = api.getState() as RootState;
  const useProxy = state.systemSettings.useProxy;
  const urlEnd = typeof args === "string" ? args : args.url;
  // construct a dynamically generated portion of the url
  const adjustedUrl = useProxy
    ? `/api/v0/proxy/elevenai/${urlEnd}`
    : `https://api.elevenlabs.io/v1/${urlEnd}`;
  const adjustedArgs =
    typeof args === "string" ? adjustedUrl : { ...args, url: adjustedUrl };
  // provide the amended url and other params to the raw base query
  return rawBaseQuery(adjustedArgs, api, extraOptions);
};

export const elevenApi = createApi({
  // Set the baseUrl for every endpoint below
  reducerPath: "elevenApi",
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
    postTextToSpeech: builder.mutation({
      query: (input: ElevenTextToSpeechInput) => ({
        url: `text-to-speech/${input.voiceId}`,
        method: "POST",
        // headers: {
        //   "xi-api-key": elevenLabsAuthToken,
        //   "Content-Type": "application/json",
        // },
        body: {
          text: input.text,
          voice_settings: {
            stability: input.stability ?? 0,
            similarity_boost: input.similarityBoost ?? 0,
          },
        },
        // responseHandler: (response) => response.blob(),
        responseHandler: async (response) => {
          const blob = await response.blob();
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        },
      }),
    }),
    // TODO: this is not working
    getTestApiKey: builder.query<any, { key: string }>({
      query: (input: { key: string }) => ({
        url: `user`,
        method: "GET",
        headers: {
          "xi-api-key": input.key,
        },
      }),
    }),
  }),
});

export const { usePostTextToSpeechMutation, useGetTestApiKeyQuery } = elevenApi;
