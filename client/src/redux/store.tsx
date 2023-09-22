import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";

const rootReducer = {
    auth: authReducer
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export type IRootState = ReturnType<typeof store.getState>;
export type IAppDispatch = typeof store.dispatch;

export default store;
