import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

import { client } from "./client";
import type { RootState } from "./Store";

export const testProxyKey = createAsyncThunk(
  "proxy/testProxyKey",
  async (payload: { proxyKey: string }, { getState, rejectWithValue }) => {
    try {
      const url = `/api/v0/proxy/key-status`;
      console.log(`proxy test key`);
      const response = await client.get(url, {
        headers: {
          "x-proxy-key": payload.proxyKey,
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (e) {
      // TODO: this is not passing though the server error body
      return rejectWithValue(e);
    }
  }
);

interface ProxyState {
  testProxyKeyResponse: string;
}

const initialState: ProxyState = {
  testProxyKeyResponse: "untested",
};

const proxySlice = createSlice({
  name: "proxy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(testProxyKey.fulfilled, (state, action) => {
      state.testProxyKeyResponse = JSON.stringify(action.payload);
    });
    builder.addCase(testProxyKey.rejected, (state, action) => {
      if (action.payload) {
        state.testProxyKeyResponse = `proxy key test failed: ${JSON.stringify(
          action.payload
        )}`;
      } else {
        state.testProxyKeyResponse = `proxy key test failed: ${action.error.message}`;
      }
    });
  },
});

export default proxySlice.reducer;
