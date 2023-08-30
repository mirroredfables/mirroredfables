import createSagaMiddleware from "redux-saga";
import { configureStore } from "@reduxjs/toolkit";
import systemSettingsReducer from "./SystemSettingsSlice";
import proxyReducer from "./ProxySlice";
import tasksReducer from "./TasksSlice";
import chatgptReducer from "./ChatgptSlice";
import imagesReducer from "./ImagesSlice";
import gameReducer from "./GameSlice";
import bookReducer from "./BookSlice";
import { elevenApi } from "./ElevenLabsSlice";
import rootSaga from "./Sagas";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    systemSettings: systemSettingsReducer,
    proxy: proxyReducer,
    tasks: tasksReducer,
    chatgpt: chatgptReducer,
    images: imagesReducer,
    game: gameReducer,
    book: bookReducer,
    [elevenApi.reducerPath]: elevenApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(elevenApi.middleware, sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
