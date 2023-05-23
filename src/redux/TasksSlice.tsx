import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

import type { RootState } from "./Store";

export interface Task {
  id: number;
  depth: number;
  name: string;
  icon: string;
  active: boolean;
  maximized: boolean;
  minimized: boolean;
  closed: boolean;
  fullscreened: boolean;
  resizable: boolean;
  width: number;
  height: number;
  positionX: number;
  positionY: number;
}

export interface NewTask {
  id?: number;
  depth?: number;
  name: string;
  icon: string;
  active?: boolean;
  maximized?: boolean;
  minimized?: boolean;
  closed?: boolean;
  fullscreened?: boolean;
  resizable?: boolean;
  width?: number;
  height?: number;
  positionX?: number;
  positionY?: number;
}

interface TasksState {
  // give new task a unique id
  nextId: number;
  // give active task a unique depth, higher depth is on top
  nextDepth: number;
  // use -1 for no active task
  currentActiveTaskId: number;
  // hidden status of taskbar
  taskbarHidden: boolean;
}

const tasksAdapter = createEntityAdapter<Task>({
  selectId: (task) => task.id,
  sortComparer: (a, b) => a.id - b.id,
});

const initialState = tasksAdapter.getInitialState({
  nextId: 0,
  nextDepth: 0,
  currentActiveTaskId: -1,
  taskbarHidden: false,
});

export const tasksSlice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    newTask: (state, action: PayloadAction<NewTask>) => {
      const previousActiveTaskId = state.currentActiveTaskId;
      if (previousActiveTaskId !== -1) {
        state.entities[previousActiveTaskId].active = false;
      }
      const task = {
        id: action.payload.id ?? state.nextId,
        depth: action.payload.depth ?? state.nextDepth,
        name: action.payload.name,
        icon: action.payload.icon,
        active: action.payload.active ?? true,
        maximized: action.payload.maximized ?? true,
        minimized: action.payload.minimized ?? false,
        closed: action.payload.closed ?? false,
        fullscreened: action.payload.fullscreened ?? false,
        resizable: action.payload.resizable ?? true,
        width: action.payload.width ?? 400,
        height: action.payload.height ?? 400,
        positionX: action.payload.positionX ?? state.nextId * 20,
        positionY: action.payload.positionY ?? state.nextId * 20,
      };

      tasksAdapter.addOne(state, task);
      state.currentActiveTaskId = action.payload.id ?? state.nextId;
      state.nextId++;
      state.nextDepth++;
      return state;
    },
    closeTask: (state, action: PayloadAction<{ id: number }>) => {
      const previousActiveTaskId = state.currentActiveTaskId;
      if (previousActiveTaskId !== -1) {
        state.entities[previousActiveTaskId].active = false;
      }
      // tasksAdapter.removeOne(state, action.payload.id);
      state.entities[action.payload.id].closed = true;
      state.currentActiveTaskId = -1;
      return state;
    },
    activateTask: (state, action: PayloadAction<{ id: number }>) => {
      if (state.currentActiveTaskId !== action.payload.id) {
        const previousActiveTaskId = state.currentActiveTaskId;
        if (previousActiveTaskId !== -1) {
          state.entities[previousActiveTaskId].active = false;
        }

        state.entities[action.payload.id].minimized = false;
        state.entities[action.payload.id].active = true;
        state.entities[action.payload.id].depth = state.nextDepth;
        state.currentActiveTaskId = action.payload.id;
        state.nextDepth++;
      }
      return state;
    },
    maximizeTask: (state, action: PayloadAction<{ id: number }>) => {
      const previousActiveTaskId = state.currentActiveTaskId;
      if (previousActiveTaskId !== -1) {
        state.entities[previousActiveTaskId].active = false;
      }

      state.entities[action.payload.id].maximized = true;

      state.entities[action.payload.id].minimized = false;
      state.entities[action.payload.id].active = true;
      state.entities[action.payload.id].depth = state.nextDepth;
      state.currentActiveTaskId = action.payload.id;
      state.nextDepth++;
      return state;
    },
    minimizeTask: (state, action: PayloadAction<{ id: number }>) => {
      const previousActiveTaskId = state.currentActiveTaskId;
      if (previousActiveTaskId !== -1) {
        state.entities[previousActiveTaskId].active = false;
      }

      state.currentActiveTaskId = -1;
      state.entities[action.payload.id].minimized = true;
      return state;
    },
    fullscreenTask: (state, action: PayloadAction<{ id: number }>) => {
      const previousActiveTaskId = state.currentActiveTaskId;
      if (previousActiveTaskId !== -1) {
        state.entities[previousActiveTaskId].active = false;
      }

      state.entities[action.payload.id].fullscreened = true;
      state.entities[action.payload.id].minimized = false;
      state.entities[action.payload.id].active = true;
      state.entities[action.payload.id].depth = state.nextDepth;
      state.currentActiveTaskId = action.payload.id;
      state.nextDepth++;
      state.taskbarHidden = true;
      return state;
    },
    exitFullscreenTask: (state, action: PayloadAction<{ id: number }>) => {
      const previousActiveTaskId = state.currentActiveTaskId;
      if (previousActiveTaskId !== -1) {
        state.entities[previousActiveTaskId].active = false;
      }

      state.entities[action.payload.id].fullscreened = false;
      state.entities[action.payload.id].minimized = false;
      state.entities[action.payload.id].active = true;
      state.entities[action.payload.id].depth = state.nextDepth;
      state.currentActiveTaskId = action.payload.id;
      state.nextDepth++;
      state.taskbarHidden = false;
      return state;
    },
    restoreTask: (state, action: PayloadAction<{ id: number }>) => {
      const previousActiveTaskId = state.currentActiveTaskId;
      if (previousActiveTaskId !== -1) {
        state.entities[previousActiveTaskId].active = false;
      }

      state.entities[action.payload.id].minimized = false;
      state.entities[action.payload.id].maximized = false;
      state.entities[action.payload.id].active = true;
      state.entities[action.payload.id].depth = state.nextDepth;
      state.currentActiveTaskId = action.payload.id;
      state.nextDepth++;
      return state;
    },
    resizeTask: (
      state,
      action: PayloadAction<{ id: number; width: number; height: number }>
    ) => {
      const previousActiveTaskId = state.currentActiveTaskId;
      if (previousActiveTaskId !== -1) {
        state.entities[previousActiveTaskId].active = false;
      }

      state.entities[action.payload.id].minimized = false;
      state.entities[action.payload.id].active = true;
      state.entities[action.payload.id].depth = state.nextDepth;
      state.currentActiveTaskId = action.payload.id;
      state.nextDepth++;

      state.entities[action.payload.id].width = action.payload.width;
      state.entities[action.payload.id].height = action.payload.height;
      return state;
    },
    moveTask: (
      state,
      action: PayloadAction<{
        id: number;
        positionX: number;
        positionY: number;
      }>
    ) => {
      const previousActiveTaskId = state.currentActiveTaskId;
      if (previousActiveTaskId !== -1) {
        state.entities[previousActiveTaskId].active = false;
      }

      state.entities[action.payload.id].minimized = false;
      state.entities[action.payload.id].active = true;
      state.entities[action.payload.id].depth = state.nextDepth;
      state.currentActiveTaskId = action.payload.id;
      state.nextDepth++;

      state.entities[action.payload.id].positionX = action.payload.positionX;
      state.entities[action.payload.id].positionY = action.payload.positionY;
      return state;
    },
  },
  extraReducers: (builder) => {},
});

export const tasksSelectors = tasksAdapter.getSelectors<RootState>(
  (state) => state.tasks
);

export const {
  newTask,
  closeTask,
  activateTask,
  maximizeTask,
  minimizeTask,
  fullscreenTask,
  exitFullscreenTask,
  restoreTask,
  resizeTask,
  moveTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;
