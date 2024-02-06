import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./Store";

interface AzureTextToSpeechInput {
  voiceId: string;
  text: string;
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
    // TODO: if using proxy, no need for azureVoiceKey
    const azureVoiceKey = state.systemSettings.azureVoiceKey;
    headers.set("Ocp-Apim-Subscription-Key", azureVoiceKey);
    headers.set("Content-Type", "application/ssml+xml");
    headers.set("X-Microsoft-OutputFormat", "riff-48khz-16bit-mono-pcm");
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
    ? `/api/v0/proxy/azurevoice/${urlEnd}`
    : `https://eastus.tts.speech.microsoft.com/cognitiveservices/${urlEnd}`;
  const adjustedArgs =
    typeof args === "string" ? adjustedUrl : { ...args, url: adjustedUrl };
  // provide the amended url and other params to the raw base query
  return rawBaseQuery(adjustedArgs, api, extraOptions);
};

export const azureVoiceApi = createApi({
  // Set the baseUrl for every endpoint below
  reducerPath: "azureVoiceApi",
  baseQuery: dynamicBaseQuery,
  endpoints: (builder) => ({
    azurePostTextToSpeech: builder.mutation({
      query: (input: AzureTextToSpeechInput) => ({
        url: `v1`,
        method: "POST",
        body: `
<speak version='1.0' xml:lang='en-US'>
<voice name='${input.voiceId}'>
${input.text}
</voice>
</speak>
`,
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
  }),
});

export const { useAzurePostTextToSpeechMutation } = azureVoiceApi;
