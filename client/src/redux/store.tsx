import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import userReducer from "./reducers/userReducer";
import socketReducer from "./reducers/socketReducer";
import chatReducer from "./reducers/chatReducer";
import dialogReducer from "./reducers/dialogReducer";

const rootReducer = {
  auth: authReducer,
  user: userReducer,
  chat: chatReducer,
  dialog: dialogReducer,
  socket: socketReducer,
};

export const initStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

const store = initStore();

export type IRootState = ReturnType<typeof store.getState>;
export type IAppDispatch = typeof store.dispatch;
export type IStore = ReturnType<typeof initStore>;

export default store;
