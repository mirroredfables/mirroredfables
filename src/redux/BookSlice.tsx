import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import { client } from "./client";
import type { RootState } from "./Store";
import {
  ChatgptMessage,
  ChatgptRequestData,
  ChatgptResponseData,
} from "./ChatgptSlice";
import {
  bookSystemPromptTemplate,
  generateBookQuotePromptTemplate,
} from "../prompts/BookPrompts";

export interface AskBookForQuoteForm {
  inputString: string;
  exampleBookQuoteInputString?: string;
  exampleBookQuoteOutputString?: string;
}

export const askBookForQuote = createAsyncThunk(
  "book/askBookForQuote",
  async (input: AskBookForQuoteForm, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const authToken = state.systemSettings.openAiKey;
      const useProxy = state.systemSettings.useProxy;
      const proxyKey = state.systemSettings.proxyKey;
      const url = useProxy
        ? `/api/v0/proxy/openai/chat/completions`
        : `https://api.openai.com/v1/chat/completions`;
      console.log(`book - askBookForQuote - ${input.inputString}`);
      const requestData: ChatgptRequestData = {
        messages: [
          {
            role: "system",
            content: bookSystemPromptTemplate,
          },
          {
            role: "user",
            content: generateBookQuotePromptTemplate(input).prompt,
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
      return rejectWithValue(err);
    }
  }
);

export const askBookForFollowup = createAsyncThunk(
  "book/askBookForFollowup",
  async (input: { inputString: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const authToken = state.systemSettings.openAiKey;
      const useProxy = state.systemSettings.useProxy;
      const proxyKey = state.systemSettings.proxyKey;
      const url = useProxy
        ? `/api/v0/proxy/openai/chat/completions`
        : `https://api.openai.com/v1/chat/completions`;
      console.log(`book - askBookForFollowup - ${input.inputString}`);
      const previousMessages = selectAllBookMessages(state).map((message) => {
        return {
          role: message.role,
          content: message.content,
        };
      });

      const requestData: ChatgptRequestData = {
        messages: [
          {
            role: "system",
            content: bookSystemPromptTemplate,
          },
          ...previousMessages,
          {
            role: "user",
            content: input.inputString,
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
      return rejectWithValue(err);
    }
  }
);

interface BookState {}

const BookAdpater = createEntityAdapter<ChatgptMessage>({
  selectId: (message) => message.id,
  sortComparer: (a, b) => a.created - b.created,
});

const initialState = BookAdpater.getInitialState<BookState>({});

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    addBookHumanMessage: (state, action: PayloadAction<{ input: string }>) => {
      const message: ChatgptMessage = {
        id: uuidv4(),
        role: "user",
        content: action.payload.input,
        created: Date.now(),
        rawData: null,
      };
      BookAdpater.upsertOne(state, message);
      return state;
    },
    resetAllMessages: (state, action: PayloadAction<{}>) => {
      BookAdpater.removeAll(state);
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      askBookForQuote.fulfilled,
      (state, action: PayloadAction<any>) => {
        const response = action.payload as ChatgptResponseData;
        const message: ChatgptMessage = {
          id: response.id,
          role: "assistant",
          content: response.choices[0].message.content,
          created: Date.now(),
          rawData: response,
        };
        BookAdpater.upsertOne(state, message);
      }
    );
    builder.addCase(
      askBookForFollowup.fulfilled,
      (state, action: PayloadAction<any>) => {
        const response = action.payload as ChatgptResponseData;
        const message: ChatgptMessage = {
          id: response.id,
          role: "assistant",
          content: response.choices[0].message.content,
          created: Date.now(),
          rawData: response,
        };
        BookAdpater.upsertOne(state, message);
      }
    );
  },
});

export const { addBookHumanMessage, resetAllMessages } = bookSlice.actions;

export default bookSlice.reducer;

export const {
  selectAll: selectAllBookMessages,
  selectById: selectBookMessageById,
} = BookAdpater.getSelectors((state: RootState) => state.book);
